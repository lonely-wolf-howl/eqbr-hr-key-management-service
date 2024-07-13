import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { LoggerModule } from 'src/providers/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
