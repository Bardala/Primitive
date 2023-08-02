import { Comment } from '@nest/shared';

export interface CommentDao {
  createComment(comment: Comment): Promise<void>;
  updateComment(comment: Pick<Comment, 'content' | 'id'>): Promise<void>;
  getComment(commentId: string): Promise<Comment>;
  deleteComment(commentId: string): Promise<void>;
}
