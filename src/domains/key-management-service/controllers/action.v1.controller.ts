import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorators/api.error.response.decorator';
import { COMMON_ERRORS } from 'src/common/errors/common.errors';
import { CatchErrors } from 'src/common/decorators/catch.errors.decorator';
import { KeyManagementService } from '../key.management.service';

@ApiTags('KeyManagement V1')
@ApiErrorResponse([COMMON_ERRORS.COMM0001, COMMON_ERRORS.COMM0003])
@Controller('v1')
export class KeyManagementV1Controller {
  constructor(private readonly keyManagementService: KeyManagementService) {}

  @Post('wallet-account')
  @CatchErrors()
  async createWalletAccount(): Promise<{ address: string }> {
    return await this.keyManagementService.createWalletAccount();
  }

  @Post('wallet-account/sign')
  @CatchErrors()
  async getSignedTransaction(@Body() data: any): Promise<any> {
    return await this.keyManagementService.getSignedTransaction(data);
  }
}
