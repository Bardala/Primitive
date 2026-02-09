import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from 'src/modules/shared/entities/like.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { LikeController } from './controllers/like.controller';
import { LikeService } from './services/like.service';
import { LikeRepository } from './repositories/like.repository';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Blog, User]), NotificationModule],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository],
  exports: [LikeService],
})
export class LikeModule {}
