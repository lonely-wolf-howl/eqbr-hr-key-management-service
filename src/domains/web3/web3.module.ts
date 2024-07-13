import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import Web3 from 'web3';
import { ServerModule } from 'src/server/server.module';
import { RedisModule } from 'src/providers/redis/redis.module';
import { RabbitmqModule } from 'src/providers/rabbitmq/rabbitmq.module';
import { LoggerModule } from 'src/providers/logger/logger.module';
import { Config } from 'src/common/config/config';

@Module({
  imports: [ServerModule, RedisModule, RabbitmqModule, LoggerModule],
  providers: [
    Web3Service,
    {
      provide: 'WEB3',
      useValue: new Web3(Config.getEnvironment().EQBR_WEB3_PROVIDER),
    },
  ],
  exports: [Web3Service],
})
export class Web3Module {}
