import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { HttpRequestOption } from './http.request.builder';
import { firstValueFrom } from 'rxjs';
import http from 'http';
import { COMMON_ERRORS } from 'src/common/errors/common.errors';
import { ApiError } from 'src/common/errors/api.error';
import { checkIsJson } from 'src/common/utils/check.is.json';

@Injectable()
export class HttpRequestService {
  constructor(private readonly httpService: HttpService) {}

  async get(options: HttpRequestOption) {
    try {
      const { serverAddr, path, config } = options;
      const url = serverAddr + path;
      const response = await firstValueFrom(this.httpService.get(url, config));
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(options: HttpRequestOption) {
    try {
      const { serverAddr, path, data, config } = options;
      const url = serverAddr + path;
      const response = await firstValueFrom(
        this.httpService.post(url, data, config),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(options: HttpRequestOption) {
    try {
      const { serverAddr, path, data, config } = options;
      const url = serverAddr + path;
      const response = await firstValueFrom(
        this.httpService.put(url, data, config),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(options: HttpRequestOption) {
    try {
      const { serverAddr, path, config } = options;
      const url = serverAddr + path;
      const response = await firstValueFrom(
        this.httpService.delete(url, config),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async pipeStream(requestOptions: HttpRequestOption, req: any) {
    const { serverAddr, path, method } = requestOptions;
    const url = serverAddr + path;
    const config = requestOptions.config;
    return new Promise((resolve, reject) => {
      const data: Buffer[] = [];

      const requestOptions = {
        method: method,
        headers: {
          ...req.headers,
          ...config,
        },
      };

      const request = req.pipe(
        http.request(url, requestOptions, (response) => {
          response
            .on('data', (chunk) => {
              data.push(chunk);
            })
            .on('end', () => {
              const result = Buffer.concat(data).toString();
              const responseData = checkIsJson(result)
                ? JSON.parse(result)
                : result;
              resolve(responseData);
            });
        }),
      );

      request.on('error', (error) => {
        reject(error);
      });
    });
  }

  private handleError(error: any) {
    if (error.response) {
      this.responseErrorHandler(error);
    } else if (error.request) {
      this.requestErrorHandler(error);
    } else {
      throw error;
    }
  }

  private responseErrorHandler(error: any) {
    if (error.response.data?.error?.code) {
      throw new HttpException(
        {
          errorCode: error.response.data.error.code,
          message: error.response.data.error.message,
          statusCode: error.response.status || 500,
        },
        error.response.status || 500,
      );
    }
    throw new HttpException(
      {
        errorCode: COMMON_ERRORS.COMM0001,
        message: error.response.data.message,
        statusCode: error.response.status || 500,
      },
      error.response.status || 500,
    );
  }

  private requestErrorHandler(error: any) {
    console.log('requestErrorHandler', error);
    throw new ApiError(COMMON_ERRORS.COMM0007);
  }
}
