import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { Config } from 'src/common/config/config';
import { CustomLogger } from 'src/providers/logger/logger.service';

@Injectable()
export class SocketService implements OnApplicationBootstrap {
  private socket: Socket;

  constructor(private readonly logger: CustomLogger) {}

  onApplicationBootstrap() {
    const socketUrl = Config.getEnvironment().SOCKET_URL;
    const handshakeQuery = {
      clientId: 'client_id',
      clientSecret: 'client_secret',
      address: 'address',
      userId: 'user_id',
    };

    this.socket = io(socketUrl, {
      query: handshakeQuery,
    });

    this.socket.on('connect', () => {
      this.logger.info('Successfully connected to Socket server');
    });

    this.socket.on('connect_error', (error) => {
      this.logger.error('Failed to connect to Socket server', error);
    });

    this.socket.on('disconnect', () => {
      this.logger.warn('Disconnected from Socket server');
    });
  }

  async ping(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.socket || !this.socket.connected) {
        this.logger.error('Socket is not connected');
        resolve(false);
        return;
      }

      this.socket.emit('ping');

      const onPong = (response: string) => {
        if (response === 'pong') {
          resolve(true);
        } else {
          resolve(false);
        }
        this.socket.off('pong', onPong);
      };

      this.socket.on('pong', onPong);

      setTimeout(() => {
        this.socket.off('pong', onPong);
        resolve(false);
      }, 1000);
    });
  }
}
