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
}
