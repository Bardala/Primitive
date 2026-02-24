import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from 'src/modules/shared/entities/tag.entity';
import { BaseValidator } from '../base.validator';

/**
 * Tag entity validator
 * Handles validation for Tag entities
 */
@Injectable()
export class TagValidator extends BaseValidator<Tag> {
  constructor(
    @InjectRepository(Tag)
    tagRepository: Repository<Tag>,
  ) {
    super(tagRepository);
  }

  /**
   * Validates that a tag exists by tag ID
   * @param tagId - The tag ID to validate
   * @returns The found tag
   */
  async validateTagExists(tagId: string): Promise<Tag> {
    return this.validateExists(tagId, 'Tag not found');
  }

  /**
   * Validates that a tag exists by its name.
   * @param name - The name of the tag to validate
   * @returns The found tag
   */
  async validateTagExistsByName(name: string): Promise<Tag> {
    return this.validateExistsWhere({ name });
  }

  async validateTagExistsByNameOrCreateNew(name: string): Promise<Tag> {
    try {
      return await this.validateTagExistsByName(name);
    } catch (error) {
      console.info(error, ' Creating new..');
      return await this.repository.save(Tag.create(name));
    }
  }
}
