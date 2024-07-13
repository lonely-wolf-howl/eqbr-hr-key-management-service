import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';
import { Config } from 'src/common/config/config';
import { CustomLogger } from 'src/providers/logger/logger.service';

export class HttpMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: CustomLogger,
    private readonly clsService: ClsService,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    res.on('finish', () => {
      const getIpFormat =
        Config.getEnvironment().NODE_ENV === 'development'
          ? `${req.ip} - `
          : '';
      const { method, originalUrl } = req;
      const { statusCode } = res;
      const duration = Date.now() - start;
      const responseMessage = `${getIpFormat}${method} ${originalUrl} ${statusCode} - ${duration}ms`;
      if (statusCode >= 400) {
        if (this.clsService.get('ApiErrorLog')) {
          // 예외처리한 오류 중 ApiErrorLog를 남긴 경우 입니다.
          const ApiErrorLog = this.clsService.get('ApiErrorLog');
          this.logger.info(
            `${responseMessage}\n${ApiErrorLog.message}`,
            `${JSON.stringify(ApiErrorLog.metadata)}`,
          );
        } else if (this.clsService.get('UnexpectedErrorLog')) {
          // 예외처리하지 못한 예상치 못한 오류입니다. UnexceptedErrorLog는 ExceptionFilter에서 저장합니다.
          const UnexpectedErrorLog = this.clsService.get('UnexpectedErrorLog');
          this.logger.error(`${responseMessage}\n${UnexpectedErrorLog.stack}`);
        } else {
          // 예외처리한 오류 중 ApiErrorLog를 남기지 않은 경우 입니다.
          this.logger.info(
            `${responseMessage} - message: ${res.statusMessage}`,
          );
        }
      } else {
        this.logger.info(responseMessage);
      }
    });
    next();
  }
}
