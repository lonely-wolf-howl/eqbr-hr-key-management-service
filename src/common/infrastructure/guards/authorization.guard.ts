import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import axios from 'axios';
import { ApiError } from '../../errors/api.error';
import { COMMON_ERRORS } from '../../errors/common.errors';
import { ConfigService } from '@nestjs/config';

const filterUrl = (baseUrl: string, path: string) => {
  const regex = new RegExp('api/v./');
  const beforePath = baseUrl + path.replace(/\/$/, '');
  return {
    path: beforePath.replace(regex, ''),
    wildcardPath: `${baseUrl.replace(regex, '')}/*`,
  };
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    try {
      const data = { ...req.params, ...req.body, ...req.query };
      const { path, wildcardPath } = filterUrl(req.baseUrl, req.route.path);
      const sender = JSON.parse(req.sender);

      if (req.authenticate_type === 'eqReferer') {
        return true;
      }

      const authorizationResult = await axios.post(
        `${this.configService.get('AUTH_SERVER_URL')}/v1/authorize`,
        {
          authenticateType: req.authenticate_type,
          headers: req.headers,
          path,
          wildcardPath,
          httpMethod: req.method,
          ...sender,
        },
      );

      req.object = authorizationResult.data;
      req.metadata = {
        path,
        httpMethod: req.method,
        wildcard_path: wildcardPath,
        micro_credit: authorizationResult.data.micro_credit,
      };

      return true;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response) {
          throw new BadRequestException(e.response.data.message);
        }
      } else {
        throw new ApiError(COMMON_ERRORS.COMM0001);
      }
    }
  }
}
