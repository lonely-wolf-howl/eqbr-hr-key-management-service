import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { RedisModule } from 'src/providers/redis/redis.module';
import { SocketModule } from 'src/domains/socket/socket.module';
import { LoggerModule } from 'src/providers/logger/logger.module';
import { RabbitmqModule } from 'src/providers/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TerminusModule,
    RedisModule,
    SocketModule,
    LoggerModule,
    RabbitmqModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
