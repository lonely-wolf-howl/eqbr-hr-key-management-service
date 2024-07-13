import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { RedisService } from 'src/providers/redis/redis.service';
import { SocketService } from 'src/domains/socket/socket.service';
@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    private readonly redisService: RedisService,
    private readonly socketService: SocketService,
  ) {
    super();
  }

  async isRedisHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.redisService.ping();
    const result = this.getStatus(key, isHealthy);
    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Redis health check failed', result);
  }

  async isSocketHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.socketService.ping();
    const result = this.getStatus(key, isHealthy);
    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Socket health check failed', result);
  }
}
