import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, createCluster } from 'redis';
import { Logger } from '@nestjs/common';
import { Config } from 'src/common/config/config';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private logger = new Logger(RedisIoAdapter.name);

  async connectToRedis(): Promise<void> {
    try {
      const { REDIS_URL } = Config.getEnvironment();
      const { REDIS_ENVIRONMENT } = Config.getEnvironment();

      let pubClient;
      let subClient;

      if (REDIS_ENVIRONMENT === 'single') {
        pubClient = createClient({
          url: REDIS_URL,
        });
        subClient = pubClient.duplicate();
      } else {
        pubClient = createCluster({
          rootNodes: [{ url: REDIS_URL }],
        });
        subClient = createCluster({
          rootNodes: [{ url: REDIS_URL }],
        });
      }

      pubClient.on('error', (err) =>
        this.logger.error('Redis PubClient Error', err),
      );
      subClient.on('error', (err) =>
        this.logger.error('Redis SubClient Error', err),
      );

      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.adapterConstructor = createAdapter(pubClient, subClient);
      this.logger.log('Redis adapter connected successfully');
    } catch (e) {
      this.logger.error('Error connecting to Redis', e);
      process.exit(1);
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
