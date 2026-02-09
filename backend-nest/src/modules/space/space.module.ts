import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
import { Member } from './entities/member.entity';
import { User } from '../user/entities/user.entity';
import { ChatMessage } from '../chat/entities/chat-message.entity';
import { Blog } from '../blog/entities/blog.entity';
import { SpaceController } from './controllers/space.controller';
import { SpaceService } from './services/space.service';
import { SpaceMemberService } from './services/space-member.service';
import { SpacePermissionService } from './services/space-permission.service';
import { ValidationModule } from '../shared/validation/validation.module';

import { SpacePermissionController } from './controllers/space-permission.controller';
import { SpacePermission } from './entities/space-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Space, Member, User, ChatMessage, Blog, SpacePermission]),
    ValidationModule,
  ],
  controllers: [SpaceController, SpacePermissionController],
  providers: [SpaceService, SpaceMemberService, SpacePermissionService],
  exports: [SpaceService, SpacePermissionService],
})
export class SpaceModule {}
