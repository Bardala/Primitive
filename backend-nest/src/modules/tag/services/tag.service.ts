import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from 'src/modules/shared/entities/tag.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  CreateTagReq,
  CreateTagRes,
  GetUserTagsRes,
  AddUserTagReq,
  AddUserTagRes,
  RemoveUserTagRes,
  AddBlogTagReq,
  AddBlogTagRes,
  RemoveBlogTagRes,
  GetBlogTagsRes,
  AddSpaceTagReq,
  AddSpaceTagRes,
  RemoveSpaceTagRes,
  GetSpaceTagsRes,
} from '../dto';
import {
  UserValidator,
  TagValidator,
  SpaceValidator,
  BlogValidator,
} from 'src/modules/shared/validation/validators';
import { ITagService } from './interfaces';
import { PageSize } from '@nest/shared';
import { FeedsResDto } from 'src/modules/blog/dto';

@Injectable()
export class TagService implements ITagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userValidator: UserValidator,
    private tagValidator: TagValidator,
    private spaceValidator: SpaceValidator,
    private blogValidator: BlogValidator,
  ) {}

  async createTag(req: CreateTagReq): Promise<CreateTagRes> {
    const existingTag = await this.tagRepository.findOne({
      where: { name: req.tagName.toLowerCase().trim() },
    });

    if (existingTag) {
      throw new ConflictException('Tag already exists');
    }

    const tag = Tag.create(req.tagName);

    await this.tagRepository.save(tag);

    return { tag };
  }

  async getUserTags(userId: string): Promise<GetUserTagsRes> {
    const user = await this.userValidator.validateExistsWithRelations(userId, ['tags']);
    return { tags: user.tags || [] };
  }

  async getUserWithTags(userId: string) {
    return await this.userValidator.validateExistsWithRelations(userId, ['tags']);
  }

  async addUserTag(userId: string, req: AddUserTagReq): Promise<AddUserTagRes> {
    const user = await this.getUserWithTags(userId);
    const tag = await this.tagValidator.validateTagExistsByNameOrCreateNew(req.tagName);

    user.tags = [...user.tags, tag];
    await this.userRepository.save(user);

    return {};
  }

  async removeUserTag(userId: string, tagId: string): Promise<RemoveUserTagRes> {
    const user = await this.userValidator.validateExistsWithRelations(userId, ['tags']);
    const tag = await this.tagValidator.validateExists(tagId);

    user.tags = user.tags.filter((t) => t.id !== tag.id);
    await this.userRepository.save(user);

    return { statusMessage: 'Tag removed from user' };
  }

  async addBlogTag(userId: string, blogId: string, req: AddBlogTagReq): Promise<AddBlogTagRes> {
    const blog = await this.blogValidator.validateExistsWithRelations(blogId, ['tags']);
    await this.blogValidator.validateUserCanAccessBlog(blogId, userId);

    const tag = await this.tagValidator.validateTagExistsByNameOrCreateNew(req.tagName);

    blog.tags = [...blog.tags, tag];
    await this.blogRepository.save(blog);

    return { statusMessage: 'Tag added successfully' };
  }

  async removeBlogTag(userId: string, blogId: string, tagId: string): Promise<RemoveBlogTagRes> {
    const blog = await this.blogValidator.validateExistsWithRelations(blogId, ['tags']);
    await this.blogValidator.validateUserCanAccessBlog(blogId, userId);

    const tag = await this.tagValidator.validateExists(tagId);

    blog.tags = blog.tags.filter((t) => t.id !== tag.id);
    await this.blogRepository.save(blog);

    return { statusMessage: 'Tag removed successfully' };
  }

  async getBlogTags(blogId: string): Promise<GetBlogTagsRes> {
    const blog = await this.blogValidator.validateExistsWithRelations(blogId, ['tags']);

    return { tags: blog.tags || [] };
  }

  async addSpaceTag(userId: string, spaceId: string, req: AddSpaceTagReq): Promise<AddSpaceTagRes> {
    const space = await this.spaceValidator.validateExistsWithRelations(spaceId, ['tags']);
    await this.spaceValidator.validateOwner(spaceId, userId);

    const tag = await this.tagValidator.validateTagExistsByNameOrCreateNew(req.tagName);

    space.tags = [...space.tags, tag];
    await this.spaceRepository.save(space);

    return { statusMessage: 'Tag added to space' };
  }

  async removeSpaceTag(userId: string, spaceId: string, tagId: string): Promise<RemoveSpaceTagRes> {
    const space = await this.spaceValidator.validateExistsWithRelations(spaceId, ['tags']);
    await this.spaceValidator.validateOwner(spaceId, userId);

    await this.tagValidator.validateExists(tagId);

    space.tags = space.tags.filter((t) => t.id !== tagId);
    await this.spaceRepository.save(space);

    return { statusMessage: 'Tag removed from space' };
  }

  async getSpaceTags(spaceId: string): Promise<GetSpaceTagsRes> {
    const space = await this.spaceValidator.validateExistsWithRelations(spaceId, ['tags']);

    return { tags: space.tags || [] };
  }

  async getBlogsByTag(tagId: string, page: number): Promise<FeedsResDto> {
    const blogs = await this.blogRepository
      .createQueryBuilder('blog')
      .innerJoin('blog.tags', 'tag')
      .where('tag.id = :tagId', { tagId })
      .orWhere('tag.name = :tagId', { tagId }) // Support searching by name or ID
      .orderBy('blog.timestamp', 'DESC')
      .skip((page - 1) * PageSize)
      .take(PageSize)
      .getMany();

    return new FeedsResDto(blogs, page);
  }
}
