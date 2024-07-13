import { Injectable, OnModuleInit } from '@nestjs/common';
import { Config } from 'src/common/config/config';
import { CustomLogger } from 'src/providers/logger/logger.service';
import {
  RedisClientType,
  RedisClusterType,
  createClient,
  createCluster,
} from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisCluster;
  constructor(private readonly logger: CustomLogger) {}

  async onModuleInit() {
    await this.initializeClient();
  }

  async initializeClient() {
    const { REDIS_URL } = Config.getEnvironment();
    const { REDIS_ENVIRONMENT } = Config.getEnvironment();

    if (REDIS_ENVIRONMENT === 'single') {
      this.redisCluster = createClient({
        url: REDIS_URL,
      });
    } else {
      this.redisCluster = createCluster({
        rootNodes: [{ url: REDIS_URL }],
      });
    }

    this.redisCluster.on('error', (err) =>
      this.logger.error('Redis Client Error', err),
    );

    await this.redisCluster.connect();
    this.logger.log('Redis Connected');
  }

  getClient(): RedisClientType | RedisClusterType {
    return this.redisCluster;
  }

  async isOpen(): Promise<boolean> {
    const { REDIS_ENVIRONMENT } = Config.getEnvironment();

    if (REDIS_ENVIRONMENT === 'single') {
      return this.redisCluster.isOpen;
    } else {
      const nodes = await this.redisCluster.nodes('master');
      return nodes.length > 0 && nodes.every((node) => node.isOpen);
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.getClient().set('ping-test-key', 'ping-test-value');
      const value = await this.getClient().get('ping-test-key');
      await this.getClient().del('ping-test-key');
      return value === 'ping-test-value';
    } catch (error) {
      this.logger.error('Redis ping failed', error);
      return false;
    }
  }
}
