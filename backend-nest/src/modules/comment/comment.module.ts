import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Blog, User])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
