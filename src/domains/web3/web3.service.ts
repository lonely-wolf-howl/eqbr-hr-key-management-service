import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class Web3Service {
  constructor(
    @Inject('WEB3')
    private readonly web3: any,
  ) {}

  async createAccount(): Promise<{ address: string; privateKey: string }> {
    const walletAccount = this.web3.eth.accounts.create();
    return {
      address: walletAccount.address,
      privateKey: walletAccount.privateKey,
    };
  }

  async getSignedTransaction(
    transactionObject: any,
    privateKey: string,
  ): Promise<any> {
    const signedTransaction = await this.web3.eth.accounts.signTransaction(
      transactionObject,
      privateKey,
    );
    return signedTransaction;
  }
}
