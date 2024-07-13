import { HttpException } from '@nestjs/common';
import { StatusCode } from './status.code';

export class ApiError extends HttpException {
  constructor(error: IApiError) {
    super(error, error.statusCode);
  }
}

export interface IApiError {
  errorCode: string;
  message: string;
  statusCode: StatusCode;
}
