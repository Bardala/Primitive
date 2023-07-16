// * Comment APIs
import { Comment, Handler, HandlerWithParams } from "../dataStore/types";

// createComment
export type CreateCommentReq = Pick<Comment, "blogId" | "content">;
export interface CreateCommentRes {}
export type UpdateCommentReq = Pick<Comment, "id" | "content">;
export interface UpdateCommentRes {}
export type DeleteCommentReq = Pick<Comment, "id">;
export interface DeleteCommentRes {}

// * Controller Interface
export interface commentController {
  createComment: Handler<CreateCommentReq, CreateCommentRes>;
  updateComment: Handler<UpdateCommentReq, UpdateCommentRes>;
  deleteComment: HandlerWithParams<
    { commentId: string },
    DeleteCommentReq,
    DeleteCommentRes
  >;
}
