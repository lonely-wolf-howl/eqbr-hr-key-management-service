// queue-routingKey.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const SUB_MESSAGE_KEY = 'routingKey';
export const subMessage = (routingKey: string) =>
  SetMetadata(SUB_MESSAGE_KEY, routingKey);
