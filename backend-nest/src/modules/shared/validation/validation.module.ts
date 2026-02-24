import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Member } from 'src/modules/space/entities/member.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Like } from '../entities/like.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { ChatMessage } from 'src/modules/chat/entities/chat-message.entity';
import { PrivateConversation } from 'src/modules/chat/entities/private-conversation.entity';
import { Tag } from '../entities/tag.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';
import {
  UserValidator,
  BlogValidator,
  SpaceValidator,
  CommentValidator,
  LikeValidator,
  MemberValidator,
  ChatValidator,
  TagValidator,
  NotificationValidator,
} from './validators';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Blog,
      Like,
      Comment,
      Space,
      User,
      Member,
      ChatMessage,
      PrivateConversation,
      Tag,
      Notification,
    ]),
  ],
  providers: [
    UserValidator,
    BlogValidator,
    SpaceValidator,
    CommentValidator,
    LikeValidator,
    MemberValidator,
    ChatValidator,
    TagValidator,
    NotificationValidator,
  ],
  exports: [
    UserValidator,
    BlogValidator,
    SpaceValidator,
    CommentValidator,
    LikeValidator,
    MemberValidator,
    ChatValidator,
    TagValidator,
    NotificationValidator,
  ],
})
export class ValidationModule {}
