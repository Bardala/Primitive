import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Comment } from '../entities/comment.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateCommentReq, CreateCommentRes } from '../dto/create-comment.dto';
import { UpdateCommentReq, UpdateCommentRes } from '../dto/update-comment.dto';
import { DeleteCommentRes } from '../dto/delete-comment.dto';
import { ICommentService } from './interfaces';

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
