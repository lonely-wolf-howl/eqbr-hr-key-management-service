import { Injectable } from '@nestjs/common';
import { Web3Service } from '../web3/web3.service';
import { WalletAccountRepository } from './repositories/wallet.account.repository';
import { WalletAccount } from './entities/wallet.account.entity';

@Injectable()
export class KeyManagementService {
  constructor(
    private readonly web3Service: Web3Service,
    private readonly walletAccountRepository: WalletAccountRepository,
  ) {}

  async createWalletAccount(): Promise<{ address: string }> {
    const response = await this.web3Service.createAccount();

    const walletAccount: WalletAccount =
      await this.walletAccountRepository.createWalletAccount({
        address: response.address,
        private_key: response.privateKey,
      });

    return { address: walletAccount.address };
  }

  async getSignedTransaction(data: any): Promise<any> {
    const walletAddress: string = data.walletAddress;
    const transactionObject: any = data.transactionObject;

    const walletAccount: WalletAccount =
      await this.walletAccountRepository.getWalletAccountByAddress(
        walletAddress,
      );
    const walletPrivateKey: string = walletAccount.private_key;

    const signedTransaction = await this.web3Service.getSignedTransaction(
      transactionObject,
      walletPrivateKey,
    );
    return signedTransaction;
  }
}
