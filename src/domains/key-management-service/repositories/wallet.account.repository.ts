import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { WalletAccount } from '../entities/wallet.account.entity';

@Injectable()
export class WalletAccountRepository {
  constructor(
    @InjectRepository(WalletAccount, 'connection1')
    private readonly walletAccountRepository: Repository<WalletAccount>,
  ) {}

  async createWalletAccount(
    data: any,
    transaction?: EntityManager,
  ): Promise<WalletAccount> {
    if (transaction) {
      return transaction.getRepository(WalletAccount).save(data);
    }
    return this.walletAccountRepository.save(data);
  }

  async getWalletAccountByAddress(
    walletAddress: string,
  ): Promise<WalletAccount> {
    return this.walletAccountRepository.findOne({
      where: { address: walletAddress },
    });
  }
}
