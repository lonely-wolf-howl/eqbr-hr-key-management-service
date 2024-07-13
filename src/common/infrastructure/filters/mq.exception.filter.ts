import { RpcException } from '@nestjs/microservices';
import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';

import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class MqExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(MqExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    this.logger.error(exception.stack);
    return throwError(() => exception.getError());
  }
}
