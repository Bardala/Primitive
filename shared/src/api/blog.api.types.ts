import { Blog, Comment, LikedUser, StatusMessage } from '../types';

// * Blog APIs
export type CreateBlogReq = Pick<Blog, 'title' | 'content' | 'spaceId'>;
export interface CreateBlogRes {
  blog: Blog;
}

export interface BlogReq {} // params.blogId
export interface BlogRes {
  blog: Blog;
}

export type updateBlogReq = Pick<Blog, 'content' | 'title' | 'spaceId'>; // params.blogId
export interface updateBlogRes {}

export interface DeleteBlogReq {} // params.blogId
export interface DeleteBlogRes {
  message: StatusMessage;
}

export interface BlogCommentsReq {} // params.blogId
export interface BlogCommentsRes {
  comments: Comment[];
}

export interface BlogLikesReq {} // params.blogId
export interface BlogLikesRes {
  likesNums: number;
}

export interface BlogLikesListReq {}
export interface BlogLikesListRes {
  users: LikedUser[];
}

export interface CreateLikeReq {}
export interface CreateLikeRes {
  message: StatusMessage;
}

export interface RemoveLikeReq {}
export interface RemoveLikeRes {
  message: StatusMessage;
}
