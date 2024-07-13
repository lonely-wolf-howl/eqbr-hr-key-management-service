import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class WsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(WsInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const wsContext = context.switchToWs();
    const client = wsContext.getClient();
    const data = wsContext.getData();

    this.logger.log(`Client connected: ${client.id}`);
    this.logger.log(`Data received: ${JSON.stringify(data)}`);

    return next
      .handle()
      .pipe(
        tap((response) =>
          this.logger.log(`Response sent: ${JSON.stringify(response)}`),
        ),
      );
  }
}
