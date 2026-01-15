import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { LastRead } from './entities/last-read.entity';
import { Space } from '../space/entities/space.entity';
import { User } from '../user/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './controllers/chat.controller';
import { Member } from '../space/entities/member.entity';
import { ChatRepository } from './repositories/chat.repository';
import {
  ChatService,
  PrivateChatService,
  UserConversationStateService,
  LastReadService,
} from './services';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, Space, User, Member, LastRead])],
  providers: [
    ChatGateway,
    ChatService,
    PrivateChatService,
    UserConversationStateService,
    ChatRepository,
    LastReadService,
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
