import { Comment, CommentWithUser } from '../types';
export type CreateCommentReq = Pick<Comment, 'content'>;
export interface CreateCommentRes {
    comment: CommentWithUser;
}
export type UpdateCommentReq = Pick<Comment, 'id' | 'content'>;
export interface UpdateCommentRes {
}
export type DeleteCommentReq = Pick<Comment, 'id'>;
export interface DeleteCommentRes {
}
