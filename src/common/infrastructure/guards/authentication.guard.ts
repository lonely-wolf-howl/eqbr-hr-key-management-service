import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ApiError } from '../../errors/api.error';
import { COMMON_ERRORS } from '../../errors/common.errors';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { headers, params, body, query } = request;

    const data = { ...params, ...body, ...query };

    try {
      const authenticateResult = await axios.post(
        `${this.configService.get('AUTH_SERVER_URL')}/v1/authenticate`,
        {
          headers,
          allowedCredentials: this.reflector.get<string[]>(
            'allowedCredentials',
            context.getHandler(),
          ),
          ...(data.client_id && { clientId: data.client_id }),
          ...(data.client_secret && { clientSecret: data.client_secret }),
        },
      );
      console.log('authenticateResult :: ', authenticateResult);
      const { authenticateType, sender } = authenticateResult.data;

      if (
        this.reflector.get<boolean>('isRequired', context.getHandler()) &&
        authenticateType === 'unknown'
      ) {
        throw new UnauthorizedException('unauthorized client');
      }

      request['authenticate_type'] = authenticateType;
      request['sender'] = JSON.stringify(sender);

      return true;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response) {
          throw new BadRequestException(e.response.data.message);
        } else if (e.request) {
          throw new BadRequestException(e.message);
        } else {
          throw new ApiError(COMMON_ERRORS.COMM0001);
        }
      } else {
        throw new BadRequestException(e.message);
      }
    }
  }
}
