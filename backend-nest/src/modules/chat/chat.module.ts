import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { LastRead } from './entities/last-read.entity';
import { Space } from '../space/entities/space.entity';
import { User } from '../user/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatController, PrivateChatController } from './controllers';
import { Member } from '../space/entities/member.entity';
import { ChatRepository } from './repositories/chat.repository';
import { ChatService, LastReadService } from './services';
import { PrivateConversationRepository } from './repositories/private-conversation.repository';
import { PrivateMessageRepository } from './repositories/private-message.repository';

import { PrivateConversation } from './entities/private-conversation.entity';
import { PrivateMessage } from './entities/private-message.entity';
import { UserConversationState } from './entities/user-conversation-state.entity';
import { PrivateChatService } from './services/private-chat.service';
import { UserConversationStateService } from './services/user-conversation-state.service';
import { UserModule } from '../user/user.module';
import { ValidationModule } from '../shared/validation/validation.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessage,
      LastRead,
      Space,
      User,
      Member,
      PrivateConversation,
      PrivateMessage,
      UserConversationState,
    ]),
    ValidationModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [ChatController, PrivateChatController],
  providers: [
    ChatGateway,
    ChatRepository,
    LastReadService,
    // UserConversationStateService must be before services that depend on it
    UserConversationStateService,
    ChatService,
    PrivateChatService,
    PrivateConversationRepository,
    PrivateMessageRepository,
  ],
  exports: [
    ChatService,
    UserConversationStateService,
    PrivateConversationRepository,
    PrivateMessageRepository,
  ],
})
export class ChatModule {}
