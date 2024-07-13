import { Module } from '@nestjs/common';
import { ServerModule } from 'src/server/server.module';
import { RedisModule } from 'src/providers/redis/redis.module';
import { LoggerModule } from 'src/providers/logger/logger.module';
import { RabbitmqModule } from 'src/providers/rabbitmq/rabbitmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyManagementV1Controller } from './controllers/action.v1.controller';
import { KeyManagementService } from './key.management.service';
import { WalletAccount } from './entities/wallet.account.entity';
import { WalletAccountRepository } from './repositories/wallet.account.repository';
import { Web3Module } from '../web3/web3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletAccount], 'connection1'),
    ServerModule,
    RedisModule,
    RabbitmqModule,
    LoggerModule,
    Web3Module,
  ],
  controllers: [KeyManagementV1Controller],
  providers: [KeyManagementService, WalletAccountRepository],
  exports: [KeyManagementService],
})
export class KeyManagementModule {}
