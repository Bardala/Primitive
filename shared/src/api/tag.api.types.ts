import { Tag } from '../types';

export interface AddBlogTagReq {
  tagName: string;
}
export interface AddBlogTagRes {}
export interface AddSpaceTagReq {
  tagName: string;
}
export interface AddSpaceTagRes {}
export interface CreateTagReq {
  tagName: string;
}
export interface CreateTagRes {
  tag: Tag;
}
export interface GetAllTagsRes {
  tags: Tag[];
}
export interface GetBlogTagsReq {}
export interface GetBlogTagsRes {
  tags: Tag[];
}
export interface GetSpaceTagsReq {}
export interface GetSpaceTagsRes {
  tags: Tag[];
}
export interface RemoveBlogTagReq {}
export interface RemoveBlogTagRes {}
export interface RemoveSpaceTagReq {}
export interface RemoveSpaceTagRes {}
export interface AddUserTagReq {
  tagName: string;
}
export interface AddUserTagRes {}
export interface RemoveUserTagReq {
  tagName: string;
}
export interface RemoveUserTagRes {}
export interface GetUserTagsReq {}
export interface GetUserTagsRes {
  tags: Tag[];
}
