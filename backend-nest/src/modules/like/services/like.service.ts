import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from 'src/modules/shared/entities/like.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { LikePostRes } from '../dto/like-post.dto';
import { UnLikePostRes } from '../dto/unlike-post.dto';
import { GetPostLikesRes } from '../dto/get-post-likes.dto';
import { ILikeService } from './interfaces';
import { NotificationService } from '../../notification/services/notification.service';
import { NotificationType } from '@nest/shared';

@Injectable()
export class LikeService implements ILikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private notificationService: NotificationService,
  ) {}

  async likePost(userId: string, postId: string): Promise<LikePostRes> {
    const blog = await this.blogRepository.findOne({ where: { id: postId } });
    if (!blog) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { blogId: postId, userId },
    });

    if (existingLike) {
      throw new ConflictException('Already liked');
    }

    const like = new Like();
    like.blogId = postId;
    like.userId = userId;

    await this.likeRepository.save(like);

    if (userId !== blog.userId) {
      await this.notificationService.sendNotification(blog.userId, NotificationType.LIKE, blog.id, {
        blogId: blog.id,
        likerId: userId,
      });
    }

    return { statusMessage: 'Post liked successfully' };
  }

  async unlikePost(userId: string, postId: string): Promise<UnLikePostRes> {
    const blog = await this.blogRepository.findOne({ where: { id: postId } });
    if (!blog) {
      throw new NotFoundException('Post not found');
    }

    const like = await this.likeRepository.findOne({
      where: { blogId: postId, userId },
    });

    if (!like) {
      throw new ConflictException('Not liked');
    }

    await this.likeRepository.delete({ blogId: postId, userId });

    return { statusMessage: 'Post unliked successfully' };
  }

  async getPostLikes(postId: string): Promise<GetPostLikesRes> {
    const blog = await this.blogRepository.findOne({ where: { id: postId } });
    if (!blog) {
      throw new NotFoundException('Post not found');
    }

    const likes = await this.likeRepository.find({
      where: { blogId: postId },
      relations: ['user'],
    });

    const users = likes.map((like) => ({
      id: like.user.id,
      username: like.user.username,
    }));

    return { users };
  }
}
