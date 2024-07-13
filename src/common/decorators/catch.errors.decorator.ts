import { InternalServerErrorException } from '@nestjs/common';
import 'reflect-metadata';

export function CatchErrors() {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = new Proxy(originalMethod, {
      apply: async function (target, thisArg, args) {
        try {
          return await target.apply(thisArg, args);
        } catch (error) {
          if (error?.response?.errorCode) {
            throw error;
          } else {
            throw new InternalServerErrorException(error);
          }
        }
      },
    });

    return descriptor;
  };
}
