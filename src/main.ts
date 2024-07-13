import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './providers/logger/logger.service';
import helmet from 'helmet';
import { TimeoutInterceptor } from './common/infrastructure/interceptors/timeout.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ApiError } from './common/errors/api.error';
import {
  ValidationERROR,
  getValidationErrors,
} from './common/errors/common.errors';
import { SetSwagger } from './common/swagger/swagger';
import { Config } from './common/config/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RedisIoAdapter } from './providers/redis/adapters/redis.io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: false,
  });

  app.useLogger(app.get(CustomLogger));

  // Security
  app.enableCors();
  app.use(helmet());

  // Global
  app.useGlobalInterceptors(new TimeoutInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const message = getValidationErrors(errors);
        return new ApiError(ValidationERROR(message));
      },
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('/api');

  // Swagger
  SetSwagger(app);

  // Socket
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [Config.getEnvironment().RABBIT_MQ_URL],
      queue: Config.getEnvironment().RABBIT_MQ_QUEUE,
      queueOptions: {
        durable: false,
      },
      noAck: false,
    },
  });
  await app.startAllMicroservices();
  await app.listen(Config.getEnvironment().SERVER_PORT);
}
bootstrap();
