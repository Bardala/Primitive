import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from 'src/modules/space/entities/space.entity';
import { BaseValidator } from '../base.validator';

/**
 * Space entity validator
 * Handles validation for Space entities
 */
@Injectable()
export class SpaceValidator extends BaseValidator<Space> {
  constructor(
    @InjectRepository(Space)
    spaceRepository: Repository<Space>,
  ) {
    super(spaceRepository);
  }

  /**
   * Validates that a space exists by space ID
   * @param spaceId - The space ID to validate
   * @returns The found space
   */
  async validateSpaceExists(spaceId: string): Promise<Space> {
    return this.validateExists(spaceId, 'Space not found');
  }

  async validateOwner(spaceId: string, userId: string) {
    const space = await this.validateSpaceExists(spaceId);
    if (space.ownerId !== userId) throw new ForbiddenException('You are not Owner');
  }

  protected getEntityName(): string {
    return 'Space';
  }
}
