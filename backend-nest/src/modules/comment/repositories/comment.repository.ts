import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  /**
   * Get the count of comments made by a user on blogs of a specific user.
   * @param userId The ID of the user whose comments are to be counted.
   * @param secUserId The ID of the user whose blogs are to be checked.
   * @returns The count of comments made by the user on blogs of the specified user.
   */
  async getFollowingCommentsCount(userId: string, secUserId: string): Promise<number> {
    return this.createQueryBuilder('comment')
      .innerJoin('comment.blog', 'blog')
      .where('comment.userId = :userId', { userId })
      .andWhere('blog.userId = :secUserId', { secUserId })
      .getCount();
  }
}
