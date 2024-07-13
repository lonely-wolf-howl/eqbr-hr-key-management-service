import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
