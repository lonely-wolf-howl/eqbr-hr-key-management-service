import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpRequestBuilder } from './services/http.request.builder';
import { HttpRequestService } from './services/http.request.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [HttpRequestBuilder, HttpRequestService],
  exports: [HttpRequestBuilder, HttpRequestService],
})
export class ServerModule {}
