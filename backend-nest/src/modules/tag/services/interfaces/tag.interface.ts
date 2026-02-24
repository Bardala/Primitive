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
} from '../../dto';

/**
 * ITagService interface
 * Responsibility: Manage tags across users, blogs, and spaces
 */
export interface ITagService {
  // Tag Creation
  createTag(req: CreateTagReq): Promise<CreateTagRes>;

  // User Tags
  getUserTags(userId: string): Promise<GetUserTagsRes>;
  addUserTag(userId: string, req: AddUserTagReq): Promise<AddUserTagRes>;
  removeUserTag(userId: string, tagId: string): Promise<RemoveUserTagRes>;

  // Blog Tags
  getBlogTags(blogId: string): Promise<GetBlogTagsRes>;
  addBlogTag(userId: string, blogId: string, req: AddBlogTagReq): Promise<AddBlogTagRes>;
  removeBlogTag(userId: string, blogId: string, tagId: string): Promise<RemoveBlogTagRes>;

  // Space Tags
  getSpaceTags(spaceId: string): Promise<GetSpaceTagsRes>;
  addSpaceTag(userId: string, spaceId: string, req: AddSpaceTagReq): Promise<AddSpaceTagRes>;
  removeSpaceTag(userId: string, spaceId: string, tagId: string): Promise<RemoveSpaceTagRes>;
}
