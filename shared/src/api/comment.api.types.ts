// * Comment APIs
import { Comment } from '../types';

// createComment
export type CreateCommentReq = Pick<Comment, 'content'>;
export interface CreateCommentRes {
  comment: Comment;
}
export type UpdateCommentReq = Pick<Comment, 'id' | 'content'>;
export interface UpdateCommentRes {}
export type DeleteCommentReq = Pick<Comment, 'id'>;
export interface DeleteCommentRes {}
