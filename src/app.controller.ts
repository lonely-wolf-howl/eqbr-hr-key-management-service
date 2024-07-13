import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomLogger } from './providers/logger/logger.service';
import { Config } from './common/config/config';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RedisService } from './providers/redis/redis.service';
import { RabbitmqService } from './providers/rabbitmq/rabbitmq.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: CustomLogger,
    private readonly rabbitMqService: RabbitmqService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  async getHello() {
    console.log(':::::::', Config.getEnvironment().SERVER_ENVIRONMENT_ID);
    this.logger.info('Hello World!', {
      service: 'AppService',
      source: { file: 'app.service.ts', function: 'getHello' },
      context: { userId: 'USER_01' },
    });
    const exchange = Config.getEnvironment().RABBIT_MQ_EXCHANGE;
    const routingKey = Config.getEnvironment().RABBIT_MQ_ROUTING_KEY;
    await this.rabbitMqService.sendMessage(
      exchange,
      routingKey,
      'sendMessage',
      'pub...',
    );
  }

  @EventPattern('sendMessage')
  async hello(@Payload() data: any, @Ctx() context: RmqContext) {
    await this.rabbitMqService.messageHandler(
      data,
      context,
      this.appService.getHello,
    );
  }

  @Get('test')
  async test() {
    console.log(1);
    const key = 'test-key';
    const value = 'test-value';

    const isConnected = await this.redisService.isOpen();
    if (!isConnected) {
      return { message: 'Redis is not connected' };
    }
    console.log(2);

    await this.redisService.getClient().set(key, value);
    console.log(3);

    const retrievedValue = await this.redisService.getClient().get(key);
    if (retrievedValue !== value) {
      return {
        message: 'Failed to retrieve the correct value from Redis',
        retrievedValue,
      };
    }
    console.log(4);

    await this.redisService.getClient().del(key);

    const deletedValue = await this.redisService.getClient().get(key);
    if (deletedValue !== null) {
      return { message: 'Failed to delete the value from Redis', deletedValue };
    }
    return {
      message: 'Redis is working correctly',
      retrievedValue,
      deletedValue,
    };
  }
}
