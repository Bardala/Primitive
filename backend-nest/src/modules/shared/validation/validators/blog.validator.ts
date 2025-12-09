import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { BaseValidator } from '../base.validator';
import { Member } from 'src/modules/space/entities/member.entity';

/**
 * Blog entity validator
 * Handles validation for Blog entities including ownership and access checks
 */
@Injectable()
export class BlogValidator extends BaseValidator<Blog> {
  constructor(
    @InjectRepository(Blog)
    blogRepository: Repository<Blog>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {
    super(blogRepository);
  }

  /**
   * Validates that a blog exists by blog ID
   * @param blogId - The blog ID to validate
   * @returns The found blog
   */
  async validateBlogExists(blogId: string): Promise<Blog> {
    return this.validateExists(blogId, 'Blog not found');
  }

  /**
   * Validates that a blog exists with space relation
   * @param blogId - The blog ID to validate
   * @returns The found blog with space
   */
  async validateBlogWithSpace(blogId: string): Promise<Blog> {
    return this.validateExistsWithRelations(blogId, ['space'], 'Blog not found');
  }

  /**
   * Validates that a blog exists with space and user relations
   * @param blogId - The blog ID to validate
   * @returns The found blog with space and user
   */
  async validateBlogWithSpaceAndUser(blogId: string): Promise<Blog> {
    return this.validateExistsWithRelations(blogId, ['space', 'user'], 'Blog not found');
  }

  /**
   * Validates that the user is the owner of the blog
   * @param blogId - The blog ID to validate
   * @param userId - The user ID to check ownership
   * @returns The found blog if user is owner
   * @throws ForbiddenException if user is not the owner
   */
  async validateUserIsBlogOwner(blogId: string, userId: string): Promise<Blog> {
    const blog = await this.validateBlogExists(blogId);
    if (blog.userId !== userId) {
      throw new ForbiddenException('You can only update your own blogs');
    }
    return blog;
  }

  /**
   * Validates that a user can access a blog (considering space privacy)
   * @param blogId - The blog ID to validate
   * @param userId - Optional user ID for access check
   * @returns The found blog if accessible
   * @throws ForbiddenException if user cannot access the blog
   */
  async validateUserCanAccessBlog(blogId: string, userId?: string): Promise<Blog> {
    const blog = await this.validateBlogWithSpace(blogId);

    if (blog.space.status === 'private') {
      if (!userId) {
        throw new ForbiddenException('This blog is in a private space');
      }
      const isMember = await this.checkMembership(blog.spaceId, userId);
      if (!isMember) {
        throw new ForbiddenException('This blog is in a private space');
      }
    }

    return blog;
  }

  /**
   * Validates that a user can access a private blog
   * @param blogId - The blog ID to validate
   * @param userId - The user ID to check access
   * @returns The found blog if user has access
   * @throws ForbiddenException if user is not a member of the private space
   */
  async validateUserCanAccessPrivateBlog(blogId: string, userId: string): Promise<Blog> {
    const blog = await this.validateBlogWithSpace(blogId);

    if (blog.space.status === 'private') {
      const isMember = await this.checkMembership(blog.spaceId, userId);
      if (!isMember) {
        throw new ForbiddenException('This blog is in a private space');
      }
    }

    return blog;
  }

  /**
   * Helper method to check if user is a member of a space
   * @param spaceId - The space ID
   * @param userId - The user ID
   * @returns true if user is a member, false otherwise
   */
  private async checkMembership(spaceId: string, userId: string): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: {
        spaceId,
        memberId: userId,
      },
    });
    return !!member;
  }

  protected getEntityName(): string {
    return 'Blog';
  }
}
