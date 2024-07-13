import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, Method } from 'axios';
import { HttpRequestService } from './http.request.service';
import { ApiError } from 'src/common/errors/api.error';
import { COMMON_ERRORS } from 'src/common/errors/common.errors';

@Injectable()
export class HttpRequestBuilder {
  private serverAddr: string;
  private method: Method;
  private path?: string;
  private data?: any;
  private config?: AxiosRequestConfig;

  constructor(private readonly httpRequestService: HttpRequestService) {}

  setServerAddr(serverAddr: string): this {
    this.serverAddr = serverAddr;
    return this;
  }

  setMethod(method: Method): this {
    this.method = method;
    return this;
  }

  setPath(path: string): this {
    this.path = path;
    return this;
  }

  setData(data: any): this {
    this.data = data;
    return this;
  }

  setConfig(config: AxiosRequestConfig): this {
    this.config = config;
    return this;
  }

  async request() {
    const requestOptions = new HttpRequestOption(
      this.serverAddr,
      this.method,
      this.path,
      this.data,
      this.config,
    );
    switch (this.method) {
      case 'GET':
        return await this.httpRequestService.get(requestOptions);
      case 'POST':
        return await this.httpRequestService.post(requestOptions);
      case 'PUT':
        return await this.httpRequestService.put(requestOptions);
      case 'DELETE':
        return await this.httpRequestService.delete(requestOptions);
      default:
        throw new ApiError(COMMON_ERRORS.COMM0001);
    }
  }
  async pipeStream(req: any) {
    const requestOptions = new HttpRequestOption(
      this.serverAddr,
      this.method,
      this.path,
      this.data,
      this.config,
    );
    return await this.httpRequestService.pipeStream(requestOptions, req);
  }
}

export class HttpRequestOption {
  serverAddr: string;
  method: Method;
  path?: string;
  data?: any;
  config?: AxiosRequestConfig;

  constructor(
    serverAddr: string,
    method: Method,
    path: string,
    data: any,
    config: AxiosRequestConfig,
  ) {
    this.serverAddr = serverAddr;
    this.method = method;
    this.path = path;
    this.data = data;
    this.config = config;
  }
}
