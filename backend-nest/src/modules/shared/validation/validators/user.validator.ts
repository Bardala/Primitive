import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { BaseValidator } from '../base.validator';

/**
 * User entity validator
 * Handles validation for User entities
 */
@Injectable()
export class UserValidator extends BaseValidator<User> {
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  /**
   * Validates that a user exists by user ID
   * @param userId - The user ID to validate
   * @returns The found user
   */
  async validateUserExists(userId: string): Promise<User> {
    return this.validateExists(userId, 'User not found');
  }

  protected getEntityName(): string {
    return 'User';
  }
}
