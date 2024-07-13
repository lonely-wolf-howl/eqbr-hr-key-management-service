import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './providers/logger/logger.module';
import { ClsModule, ClsService } from 'nestjs-cls';
import { v1 as uuid } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerModule } from './server/server.module';
import { HealthModule } from './health-check/health.module';
import { HttpMiddleware } from './common/infrastructure/middlewares/http.middleware';
import { CustomLogger } from './providers/logger/logger.service';
import { SocketModule } from './domains/socket/socket.module';
import { RedisModule } from './providers/redis/redis.module';
import { Config } from './common/config/config';
import { isUUID } from 'class-validator';
import { RabbitmqModule } from './providers/rabbitmq/rabbitmq.module';
import { KeyManagementModule } from './domains/key-management-service/key.management.module';
import { WalletAccount } from './domains/key-management-service/entities/wallet.account.entity';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => {
          const requestId = req.headers['x-request-id'];

          if (requestId && isUUID(requestId as string)) {
            return requestId;
          }

          return uuid();
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      name: 'connection1',
      useFactory: () => ({
        type: Config.getEnvironment().DB_1.DB_TYPE,
        username: Config.getEnvironment().DB_1.DB_USERNAME,
        password: Config.getEnvironment().DB_1.DB_PASSWORD,
        host: Config.getEnvironment().DB_1.DB_HOST,
        port: Config.getEnvironment().DB_1.DB_PORT,
        database: Config.getEnvironment().DB_1.DB_DATABASE,
        entities: [WalletAccount],
        synchronize: Config.getEnvironment().NODE_ENV !== 'production',
        timezone: 'Z',
        logging: true,
      }),
    }),
    RedisModule,
    LoggerModule,
    ServerModule,
    HealthModule,
    SocketModule,
    RabbitmqModule,
    KeyManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private readonly logger: CustomLogger,
    private readonly clsService: ClsService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        new HttpMiddleware(this.logger, this.clsService).use(req, res, next);
      })
      .forRoutes('*');
  }
}
