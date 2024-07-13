import { IsObject, IsString } from 'class-validator';

export class CreateWalletAccountReqDto {
  @IsString()
  walletAddress: string;

  @IsObject()
  transactionObject: any;
}
