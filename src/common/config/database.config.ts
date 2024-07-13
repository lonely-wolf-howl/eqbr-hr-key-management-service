import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class DatabaseConfig {
  @IsIn(['mysql', 'postgres'])
  DB_TYPE: 'mysql' | 'postgres';

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @Type(() => Number)
  @IsNumber()
  DB_PORT: number;
}
