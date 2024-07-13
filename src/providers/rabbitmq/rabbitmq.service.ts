import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Config } from 'src/common/config/config';
import { CustomLogger } from '../logger/logger.service';
import { RmqContext } from '@nestjs/microservices';
import { waitForSeconds } from '../../common/utils/wait';

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly logger: CustomLogger) {}

  async onModuleInit() {
    await this.connectChannel();
    await this.bindQueue();
  }

  async connectChannel() {
    if (Config.getEnvironment().RABBIT_MQ_ENVIRONMENT === 'local') {
      this.connection = await amqp.connect({
        protocol: Config.getEnvironment().RABBIT_MQ_PROTOCOL,
        hostname: Config.getEnvironment().RABBIT_MQ_HOST,
        username: Config.getEnvironment().RABBIT_MQ_ID,
        password: Config.getEnvironment().RABBIT_MQ_PASSWORD,
        port: Config.getEnvironment().RABBIT_MQ_PORT,
      });
    } else if (Config.getEnvironment().RABBIT_MQ_ENVIRONMENT === 'aws') {
      // TODO: config 추가 필요 (AWS 환경에서 사용할 때)
    }
    this.channel = await this.connection.createChannel();
  }

  async assertExchange(exchange: string, type: string) {
    await this.channel.assertExchange(exchange, type, { durable: false });
  }

  async bindQueue() {
    const queue = Config.getEnvironment().RABBIT_MQ_QUEUE;
    const exchange = Config.getEnvironment().RABBIT_MQ_EXCHANGE;
    const routingKey = Config.getEnvironment().RABBIT_MQ_ROUTING_KEY;

    await this.assertExchange(exchange, 'direct');

    await this.channel.assertQueue(queue, { durable: false });
    await this.channel.bindQueue(queue, exchange, routingKey);
  }

  async sendMessage(
    exchange: string,
    routingKey: string,
    pattern: string,
    data: any,
  ) {
    try {
      if (this.channel === undefined) {
        this.logger.error('RabbitMQ channel is not connected');
        await this.connectChannel();
        return;
      }

      const messageBuffer = Buffer.from(
        JSON.stringify({
          pattern,
          data,
        }),
      );
      this.channel.publish(exchange, routingKey, messageBuffer);
      this.logger.info(`Sent: [${routingKey}] ${data}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async messageHandler(
    data: any,
    context: RmqContext,
    functionName: any,
    retry = 0,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    const retryCount = Config.getEnvironment().RABBIT_MQ_RETRY_COUNT;
    try {
      await functionName(data);
      channel.ack(message);
    } catch (error) {
      await waitForSeconds(0.5);
      if (retry <= retryCount) {
        retry += 1;
        await this.messageHandler(data, context, functionName, retry);
      }
      console.log(`${functionName} occur error`, error);
      channel.ack(message);
    }
  }
}
