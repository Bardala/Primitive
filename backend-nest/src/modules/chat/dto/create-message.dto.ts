import { IsString, IsNotEmpty } from 'class-validator';
import type {
  CreateMsgReq as ICreateMsgReq,
  CreateMsgRes as ICreateMsgRes,
  ChatMessage,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMsgReq implements ICreateMsgReq {
  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Message content',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class CreateMsgRes implements ICreateMsgRes {
  @ApiProperty({
    description: 'Created message object',
  })
  message!: ChatMessage;
}
