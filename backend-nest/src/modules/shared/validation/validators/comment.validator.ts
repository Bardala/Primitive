import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { BaseValidator } from '../base.validator';

/**
 * Comment entity validator
 * Handles validation for Comment entities
 */
@Injectable()
export class CommentValidator extends BaseValidator<Comment> {
  constructor(
    @InjectRepository(Comment)
    commentRepository: Repository<Comment>,
  ) {
    super(commentRepository);
  }

  /**
   * Validates that a comment exists by comment ID
   * @param commentId - The comment ID to validate
   * @returns The found comment
   */
  async validateCommentExists(commentId: string): Promise<Comment> {
    return this.validateExists(commentId, 'Comment not found');
  }

  /**
   * Validates that a comment exists with relations
   * @param commentId - The comment ID to validate
   * @returns The found comment with blog and author relations
   */
  async validateCommentWithRelations(commentId: string): Promise<Comment> {
    return this.validateExistsWithRelations(commentId, ['blog', 'author'], 'Comment not found');
  }

  protected getEntityName(): string {
    return 'Comment';
  }
}
