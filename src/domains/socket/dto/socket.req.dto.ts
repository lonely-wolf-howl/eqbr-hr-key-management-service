import { IsString } from 'class-validator';

export class SendMessageReqDto {
  @IsString()
  title: string;

  @IsString()
  message: string;
}
