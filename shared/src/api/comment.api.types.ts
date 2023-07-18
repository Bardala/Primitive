// * Comment APIs
import { Comment } from "../src/types";

// createComment
export type CreateCommentReq = Pick<Comment, "blogId" | "content">;
export interface CreateCommentRes {}
export type UpdateCommentReq = Pick<Comment, "id" | "content">;
export interface UpdateCommentRes {}
export type DeleteCommentReq = Pick<Comment, "id">;
export interface DeleteCommentRes {}
