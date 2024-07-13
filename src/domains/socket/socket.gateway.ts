import {
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketExceptionFilter } from 'src/common/infrastructure/filters/socket.exception.filter';
import { SendMessageReqDto } from './dto/socket.req.dto';
import { WsInterceptor } from 'src/common/infrastructure/interceptors/ws.interceptor';
import { ApiError } from 'src/common/errors/api.error';
import { COMMON_ERRORS } from 'src/common/errors/common.errors';
import { CustomLogger } from 'src/providers/logger/logger.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'socket',
})
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseFilters(SocketExceptionFilter)
@UseInterceptors(WsInterceptor)
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly logger: CustomLogger) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.server.use(async (socket, next) => {
      try {
        const clientId = socket.handshake.query.clientId as string;
        const clientSecret = socket.handshake.query.clientSecret as string;
        const address = socket.handshake.query.address as string;
        const userId = socket.handshake.query.userId as string;

        if (!clientId || !clientSecret || !address || !userId) {
          return next(new ApiError(COMMON_ERRORS.COMM0006));
        }

        socket.data.clientId = clientId;
        socket.data.clientSecret = clientSecret;
        socket.data.address = address;
        socket.data.userId = userId;

        next();
      } catch (err) {
        next(new ApiError(COMMON_ERRORS.COMM0006));
      }
    });
    this.logger.log('Socket server initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log('Client connected:', client.id);
    client.emit('message', 'Welcome to the WebSocket server');
  }

  handleDisconnect(client: Socket): void {
    this.logger.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: SendMessageReqDto,
    @ConnectedSocket() client: Socket,
  ): void {
    // throw new WsException('This is a test exception');
    this.logger.log(`Received message:, ${JSON.stringify(message)}`);
    this.server.emit('message', `Server received: ${JSON.stringify(message)}`);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): void {
    this.logger.log(`Received ping from: ${client.id}`);
    client.emit('pong', 'pong');
  }
}
