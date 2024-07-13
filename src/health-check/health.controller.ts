import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HEAP_THRESHOLD } from './constants/heap.threshold';
import { RSS_THRESHOLD } from './constants/rss.threshold';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Transport } from '@nestjs/microservices';
import { Config } from '../common/config/config';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    @InjectDataSource('connection1')
    private readonly connection1: DataSource,
    // @InjectDataSource('connection2')
    // private readonly connection2: DataSource,
    private memory: MemoryHealthIndicator,
    private readonly healthService: HealthService,
  ) {}

  @ApiOperation({
    summary: 'Health Check',
    description:
      'DATABASE, HEAP_MEMORY, RSS_MEMORY, REDIS, SOCKET, RABBIT_MQ Health Check',
  })
  @Get()
  @HealthCheck()
  async healthCheck(): Promise<HealthCheckResult> {
    const healthCheckResult = await this.health.check([
      async () => this.memory.checkHeap('memory_heap', HEAP_THRESHOLD),
      async () => this.memory.checkRSS('memory_rss', RSS_THRESHOLD),
      async () =>
        this.db.pingCheck('database1', { connection: this.connection1 }),
      async () => this.healthService.isRedisHealthy('redis'),
      async () => this.healthService.isSocketHealthy('socket'),
      async () =>
        this.microservice.pingCheck('rabbitMQ', {
          transport: Transport.RMQ,
          options: {
            urls: [Config.getEnvironment().RABBIT_MQ_URL],
          },
        }),
    ]);
    return healthCheckResult;
  }
}
