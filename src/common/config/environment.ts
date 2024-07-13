import { Type, plainToClass } from 'class-transformer';
import { IsIn, IsNumber, IsString, ValidateNested } from 'class-validator';
import { DatabaseConfig } from './database.config';

export class Environment {
  // SERVER
  @IsIn(['production', 'test', 'development'])
  NODE_ENV = process.env.NODE_ENV as 'production' | 'test' | 'development';
  @Type(() => Number)
  @IsNumber()
  SERVER_PORT = process.env?.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 3005;
  @IsString()
  SERVER_ENVIRONMENT_ID = process.env.SERVER_ENVIRONMENT_ID as string;

  // AWS_S3
  @IsString()
  S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID as string;
  @IsString()
  S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY as string;
  @IsString()
  S3_REGION = process.env.S3_REGION as string;
  @IsString()
  S3_NAME = process.env.S3_NAME as string;

  // REDIS
  @IsString()
  REDIS_HOST = process.env.REDIS_HOST as string;
  @IsString()
  REDIS_URL = process.env.REDIS_URL as string;
  @IsString()
  REDIS_ENVIRONMENT = process.env.REDIS_ENVIRONMENT as string;
  @Type(() => Number)
  @IsNumber()
  REDIS_PORT = Number(process.env.REDIS_PORT);

  // RABBIT_MQ
  @IsString()
  RABBIT_MQ_PROTOCOL = process.env.RABBIT_MQ_PROTOCOL as string;
  @IsString()
  RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST as string;
  @IsString()
  RABBIT_MQ_ID = process.env.RABBIT_MQ_ID as string;
  @IsString()
  RABBIT_MQ_PASSWORD = process.env.RABBIT_MQ_PASSWORD as string;
  @IsString()
  RABBIT_MQ_ENVIRONMENT = process.env.RABBIT_MQ_ENVIRONMENT as string;
  @Type(() => Number)
  @IsNumber()
  RABBIT_MQ_PORT = Number(process.env.RABBIT_MQ_PORT);
  @Type(() => Number)
  @IsNumber()
  RABBIT_MQ_RETRY_COUNT = 10;
  @IsString()
  RABBIT_MQ_QUEUE = `${process.env.SERVER_ENVIRONMENT_ID as string}_TEST`;
  @IsString()
  RABBIT_MQ_EXCHANGE =
    `${process.env.SERVER_ENVIRONMENT_ID as string}_DIRECT_Test`;
  @IsString()
  RABBIT_MQ_ROUTING_KEY = `${process.env.SERVER_ENVIRONMENT_ID as string}_TEST`;
  @IsString()
  RABBIT_MQ_URL =
    `${process.env.RABBIT_MQ_PROTOCOL as string}://${process.env.RABBIT_MQ_ID as string}:${process.env.RABBIT_MQ_PASSWORD as string}@${process.env.RABBIT_MQ_HOST as string}:${Number(process.env.RABBIT_MQ_PORT)}`;

  // SOCKET
  @IsString()
  SOCKET_URL = process.env.SOCKET_URL as string;

  // DB
  @ValidateNested()
  @Type(() => DatabaseConfig)
  DB_1: DatabaseConfig = plainToClass(DatabaseConfig, {
    DB_TYPE: process.env.DB_TYPE,
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PORT: Number(process.env.DB_PORT),
  });

  @ValidateNested()
  @Type(() => DatabaseConfig)
  DB_2: DatabaseConfig = plainToClass(DatabaseConfig, {
    DB_TYPE: process.env.DB_TYPE_2,
    DB_HOST: process.env.DB_HOST_2,
    DB_USERNAME: process.env.DB_USERNAME_2,
    DB_PASSWORD: process.env.DB_PASSWORD_2,
    DB_DATABASE: process.env.DB_DATABASE_2,
    DB_PORT: Number(process.env.DB_PORT_2),
  });

  // WEB3
  @IsString()
  EQBR_WEB3_PROVIDER = process.env.EQBR_WEB3_PROVIDER as string;
}
