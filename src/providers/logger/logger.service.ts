import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { ClsService } from 'nestjs-cls';
import { Config } from 'src/common/config/config';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class CustomLogger implements LoggerService {
  constructor(private readonly clsService: ClsService) {}
  logger = winston.createLogger({
    level: Config.getEnvironment().NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss Z',
      }),
      winston.format.splat(),
      Config.getEnvironment().NODE_ENV === 'production'
        ? winston.format.uncolorize()
        : winston.format.colorize(),

      winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        const requestId = this.clsService.getId();
        const transformedMetadata = this.toStringOrJson(metadata);
        const transformedMessage = this.toStringOrJson(message);

        return `${timestamp} : [${requestId ?? ''}] : ${level} : ${transformedMessage} : ${transformedMetadata}`;
      }),
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error'],
      }),
      new DailyRotateFile({
        level: 'error',
        format: winston.format.uncolorize(),
        filename: '%DATE%.error.log',
        dirname: 'logs/error',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '30d',
        auditFile: 'logs/error/audit.json',
      }),
    ],
  });

  toStringOrJson(metadata: Record<string, any>): string {
    let transformedMetadata: string;
    if (Object.keys(metadata).every((key) => !isNaN(parseInt(key)))) {
      transformedMetadata = Object.values(metadata).reduce(
        (str, key) => str + key,
        '',
      );
    } else {
      transformedMetadata = JSON.stringify(metadata);
    }
    return transformedMetadata;
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.log('info', message, ...optionalParams);
  }

  info(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }
}
