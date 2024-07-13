import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MqInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MqInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rabbitMqContext = context.switchToRpc();
    const getData = rabbitMqContext.getData();

    this.logger.log(`data : ${getData}`);

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `Intercepted ${context.getClass().name}.${context.getHandler().name}`,
          ),
        ),
      );
  }
}
