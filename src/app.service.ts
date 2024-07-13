import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(content: any): string {
    console.log(':::::::', content);
    return 'Hello World!';
  }
}
