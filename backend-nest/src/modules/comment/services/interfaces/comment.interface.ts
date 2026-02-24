import {
  CreateCommentReq,
  CreateCommentRes,
  UpdateCommentReq,
  UpdateCommentRes,
  DeleteCommentRes,
} from '../../dto';

/**
 * ICommentService interface
 * Responsibility: Handle comment operations on blogs
 */
export interface ICommentService {
  createComment(userId: string, blogId: string, req: CreateCommentReq): Promise<CreateCommentRes>;
  updateComment(userId: string, req: UpdateCommentReq): Promise<UpdateCommentRes>;
  deleteComment(userId: string, commentId: string): Promise<DeleteCommentRes>;
}
