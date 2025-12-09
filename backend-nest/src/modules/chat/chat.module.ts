import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Space } from '../space/entities/space.entity';
import { User } from '../user/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { PrivateChatService } from './services/private-chat.service';
import { UserConversationStateService } from './services/user-conversation-state.service';
import { Member } from '../space/entities/member.entity';
import { ChatRepository } from './repositories/chat.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, Space, User, Member])],
  providers: [
    ChatGateway,
    ChatService,
    PrivateChatService,
    UserConversationStateService,
    ChatRepository,
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
