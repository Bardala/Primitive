// * Comment APIs
import { Blog, Comment } from "../dataStore/types";

// createComment
export type CreateCommentReq = Pick<Comment, "blogId" | "content">;
export interface CreateCommentRes {
  comment: Comment;
}

// getComments
export type BlogCommentsReq = Pick<Blog, "id">;
export interface BlogCommentRes {
  comments: Comment[];
}
