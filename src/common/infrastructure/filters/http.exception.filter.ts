import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { COMMON_ERRORS } from 'src/common/errors/common.errors';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly clsService: ClsService) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    if (exceptionResponse?.errorCode) {
      response
        .status(status)
        .json(
          errorResponse(exceptionResponse.errorCode, exceptionResponse.message),
        );
      return;
    }

    if (exceptionResponse?.statusCode && exceptionResponse?.message) {
      response
        .status(status)
        .json(
          errorResponse(
            COMMON_ERRORS.COMM0001.errorCode,
            exceptionResponse.message,
          ),
        );
      return;
    }

    this.clsService.set('UnexpectedErrorLog', exceptionResponse);
    response
      .status(status)
      .json(
        errorResponse(
          COMMON_ERRORS.COMM0001.errorCode,
          COMMON_ERRORS.COMM0001.message,
        ),
      );
  }
}

const errorResponse = (errorCode: string, message: string) => {
  return {
    error: {
      code: errorCode,
      message: message,
    },
  };
};
