import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from 'src/modules/shared/entities/like.entity';
import { BaseValidator } from '../base.validator';

/**
 * Like entity validator
 * Handles validation for Like entities
 */
@Injectable()
export class LikeValidator extends BaseValidator<Like> {
  constructor(
    @InjectRepository(Like)
    likeRepository: Repository<Like>,
  ) {
    super(likeRepository);
  }

  /**
   * Validates that a like does not already exist
   * @param blogId - The blog ID
   * @param userId - The user ID
   * @throws ConflictException if like already exists
   */
  async validateLikeDoesNotExist(blogId: string, userId: string): Promise<void> {
    const existingLike = await this.repository.findOne({
      where: { blogId, userId },
    });

    if (existingLike) {
      throw new ConflictException('Already liked');
    }
  }

  /**
   * Validates that a like exists
   * @param blogId - The blog ID
   * @param userId - The user ID
   * @returns The found like
   * @throws ConflictException if like does not exist
   */
  async validateLikeExists(blogId: string, userId: string): Promise<Like> {
    const like = await this.repository.findOne({
      where: { blogId, userId },
    });

    if (!like) {
      throw new ConflictException('Not liked');
    }

    return like;
  }

  protected getEntityName(): string {
    return 'Like';
  }
}
