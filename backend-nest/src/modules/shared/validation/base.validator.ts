import { NotFoundException } from '@nestjs/common';
import { Repository, ObjectLiteral, FindOptionsWhere } from 'typeorm';

/**
 * Abstract base class for entity validators
 * Provides common validation functionality following OOP best practices
 */
export abstract class BaseValidator<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  /**
   * Validates that an entity exists by ID
   * @param id - The entity ID to validate
   * @param errorMessage - Custom error message
   * @returns The found entity
   * @throws NotFoundException if entity not found
   */
  async validateExists(id: string, errorMessage?: string): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(errorMessage || `${this.getEntityName()} not found`);
    }
    return entity;
  }

  /**
   * Validates that an entity exists by ID with relations
   * @param id - The entity ID to validate
   * @param relations - Relations to load
   * @param errorMessage - Custom error message
   * @returns The found entity with relations
   * @throws NotFoundException if entity not found
   */
  async validateExistsWithRelations(
    id: string,
    relations: (keyof T)[],
    errorMessage?: string,
  ): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as any,
      relations: relations as string[],
    });
    if (!entity) {
      throw new NotFoundException(errorMessage || `${this.getEntityName()} not found`);
    }
    return entity;
  }

  /**
   * Validates that an entity exists with custom where clause
   * @param where - Custom where clause
   * @param errorMessage - Custom error message
   * @returns The found entity
   * @throws NotFoundException if entity not found
   */
  async validateExistsWhere(where: FindOptionsWhere<T>, errorMessage?: string): Promise<T> {
    const entity = await this.repository.findOne({ where });
    if (!entity) {
      throw new NotFoundException(errorMessage || `${this.getEntityName()} not found`);
    }
    return entity;
  }

  /**
   * Gets the entity name for error messages
   * Override this method in subclasses for custom naming
   */
  protected getEntityName(): string {
    return this.constructor.name.replace('Validator', '');
  }
}
