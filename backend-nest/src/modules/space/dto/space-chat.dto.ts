import { ChatReq as IChatReq, ChatRes as IChatRes, ChatMessage } from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class ChatReq implements IChatReq {}

export class ChatRes implements IChatRes {
  @ApiProperty({
    description: 'List of chat messages in the space',
  })
  messages!: ChatMessage[];
}
