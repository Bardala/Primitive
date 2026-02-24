import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserActivityService } from './services/user-activity.service';
import { User } from './entities/user.entity';
import { UserActivity } from './entities/user-activity.entity';
import { Blog } from '../blog/entities/blog.entity';
import { Follow } from '../shared/entities/follow.entity';
import { Space } from '../space/entities/space.entity';
import { Member } from '../space/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserActivity, Follow, Blog, Space, Member])],
  controllers: [UserController],
  providers: [UserService, UserActivityService],
  exports: [UserService, UserActivityService, TypeOrmModule],
})
export class UserModule {}
