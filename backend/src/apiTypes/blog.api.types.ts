import {
  Blog,
  Comment,
  Handler,
  HandlerWithParams,
  Like,
} from "../dataStore/types";

// * Blog APIs
export type CreateBlogReq = Pick<Blog, "title" | "content" | "spaceId">;
export interface CreateBlogRes {}

export interface BlogReq {} // params.blogId
export interface BlogRes {
  blog: Blog;
}

export type updateBlogReq = Pick<Blog, "content" | "title" | "spaceId">; // params.blogId
export interface updateBlogRes {}

export interface DeleteBlogReq {} // params.blogId
export interface DeleteBlogRes {}

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
  likes: Like[];
}

// * Controller Interface
export interface blogController {
  createBlog: Handler<CreateBlogReq, CreateBlogRes>;
  updateBlog: HandlerWithParams<
    { blogId: string },
    updateBlogReq,
    updateBlogRes
  >;
  getBlog: HandlerWithParams<{ blogId: string }, BlogReq, BlogRes>;
  deleteBlog: HandlerWithParams<
    { blogId: string },
    DeleteBlogReq,
    DeleteBlogRes
  >;
  getBlogComments: HandlerWithParams<
    { blogId: string },
    BlogCommentsReq,
    BlogCommentsRes
  >;
  getBlogLikes: HandlerWithParams<
    { blogId: string },
    BlogLikesReq,
    BlogLikesRes
  >;
  getBlogLikesList: HandlerWithParams<
    { blogId: string },
    BlogLikesListReq,
    BlogLikesListRes
  >;
}
