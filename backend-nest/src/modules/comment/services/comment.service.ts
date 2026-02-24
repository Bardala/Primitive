import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Comment } from '../entities/comment.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateCommentReq, CreateCommentRes } from '../dto/create-comment.dto';
import { UpdateCommentReq, UpdateCommentRes } from '../dto/update-comment.dto';
import { DeleteCommentRes } from '../dto/delete-comment.dto';
import { ICommentService } from './interfaces';
import { NotificationService } from '../../notification/services/notification.service';
import { NotificationType } from '@nest/shared';

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationService: NotificationService,
  ) {}

  async createComment(
    userId: string,
    blogId: string,
    req: CreateCommentReq,
  ): Promise<CreateCommentRes> {
    if (!req.content || !blogId) {
      throw new BadRequestException('All fields are required');
    }

    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = new Comment();
    comment.id = randomUUID();
    comment.userId = userId;
    comment.content = req.content;
    comment.blogId = blogId;
    comment.timestamp = Date.now();

    await this.commentRepository.save(comment);

    if (user.id !== blog.userId) {
      await this.notificationService.sendNotification(
        blog.userId,
        NotificationType.COMMENT,
        blog.id,
        {
          blogId: blog.id,
          commentId: comment.id,
          commenterId: userId,
        },
      );
    }

    // Handle mentions
    const mentionRegex = /@(\w+)/g;
    const matches = req.content.match(mentionRegex);
    if (matches) {
      const usernames = matches.map((m) => m.slice(1));
      const mentionedUsers = await this.userRepository.find({
        where: { username: In(usernames) },
      });

      for (const mentionedUser of mentionedUsers) {
        if (mentionedUser.id !== userId) {
          await this.notificationService.sendNotification(
            mentionedUser.id,
            NotificationType.MENTION,
            blog.id,
            {
              blogId: blog.id,
              commentId: comment.id,
              mentionerId: userId,
            },
          );
        }
      }
    }

    return { comment: comment as any };
  }

  async updateComment(userId: string, req: UpdateCommentReq): Promise<UpdateCommentRes> {
    if (!req.id || !req.content) {
      throw new BadRequestException('All fields are required');
    }

    const comment = await this.commentRepository.findOne({ where: { id: req.id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    comment.content = req.content;

    await this.commentRepository.save(comment);

    return { statusMessage: 'Comment updated successfully' };
  }

  async deleteComment(userId: string, commentId: string): Promise<DeleteCommentRes> {
    if (!commentId) {
      throw new BadRequestException('Comment ID is required');
    }

    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.delete(commentId);

    return { statusMessage: 'Comment deleted successfully' };
  }
}
