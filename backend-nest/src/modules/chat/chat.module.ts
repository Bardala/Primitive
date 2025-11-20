import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { PrivateChatService } from './services/private-chat.service';
import { UserConversationStateService } from './services/user-conversation-state.service';

@Module({
  providers: [ChatGateway, ChatService, PrivateChatService, UserConversationStateService],
  controllers: [ChatController],
})
export class ChatModule {}
