import { BlogTag, SpaceTag, Tag, UserTag } from '@nest/shared';

export interface TagDao {
  // Tag operations
  createTag(tag: Tag): Promise<void>;
  getTag(tagId: string): Promise<Tag | undefined>;
  getTagByName(name: string): Promise<Tag | undefined>;
  getAllTags(): Promise<Tag[]>;
  deleteTag(tagId: string): Promise<void>;

  // Blog tags
  addBlogTag(blogTag: BlogTag): Promise<void>;
  removeBlogTag(blogTag: BlogTag): Promise<void>;
  getBlogTags(blogId: string): Promise<Tag[]>;
  getBlogsByTag(tagId: string, limit?: number, offset?: number): Promise<string[]>; // returns blog IDs

  // Space tags
  addSpaceTag(spaceTag: SpaceTag): Promise<void>;
  removeSpaceTag(spaceTag: SpaceTag): Promise<void>;
  getSpaceTags(spaceId: string): Promise<Tag[]>;
  getSpacesByTag(tagId: string): Promise<string[]>; // returns space IDs

  // User tags
  addUserTag(userTag: UserTag): Promise<void>;
  removeUserTag(userTag: UserTag): Promise<void>;
  getUserTags(userId: string): Promise<Tag[]>;
  getUsersByTag(tagId: string): Promise<string[]>;
}
