import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Like } from 'src/modules/shared/entities/like.entity';

@Injectable()
export class LikeRepository extends Repository<Like> {
  constructor(dataSource: DataSource) {
    super(Like, dataSource.createEntityManager());
  }

  async findByBlogAndUser(blogId: string, userId: string): Promise<Like | null> {
    return this.findOne({
      where: { blogId, userId },
      relations: ['user'],
    });
  }

  async findByBlogId(blogId: string): Promise<Like[]> {
    return this.find({
      where: { blogId },
      relations: ['user'],
    });
  }

  /**
   * Get the count of likes made by a user on blogs of a specific user.
   * @param userId The ID of the user whose likes are to be counted.
   * @param secUserId The ID of the user whose blogs are to be checked.
   * @returns The count of likes made by the user on blogs of the specified user.
   */
  async getFollowingLikesCount(userId: string, secUserId: string): Promise<number> {
    return this.createQueryBuilder('like')
      .innerJoin('like.blog', 'blog')
      .where('like.userId = :userId', { userId })
      .andWhere('blog.userId = :secUserId', { secUserId })
      .getCount();
  }
}
