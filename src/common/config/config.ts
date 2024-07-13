import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Environment } from './environment';
import { config as dotenvConfig } from 'dotenv';

export class Config {
  private static instance: Environment;

  private constructor() {}

  public static getEnvironment(): Environment {
    if (!Config.instance) {
      const envFilePath = `.env.${process.env.NODE_ENV}`;
      dotenvConfig({ path: envFilePath });
      Config.instance = Config.validate(process.env);
      Config.instance = Object.freeze(Config.instance);
    }
    return Config.instance;
  }

  public static validate(config: Record<string, unknown>): Environment {
    const validatedConfig = plainToInstance(Environment, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return validatedConfig;
  }
}
