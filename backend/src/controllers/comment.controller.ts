import {
  CreateCommentReq,
  CreateCommentRes,
  UpdateCommentReq,
  UpdateCommentRes,
  DeleteCommentReq,
  DeleteCommentRes,
  Errors,
  Comment,
} from '@nest/shared';
import { DataStoreDao } from '../dataStore';
import { Handler, HandlerWithParams } from '../types';

// * Controller Interface
export interface commentController {
  createComment: HandlerWithParams<{ blogId: string }, CreateCommentReq, CreateCommentRes>;
  updateComment: Handler<UpdateCommentReq, UpdateCommentRes>;
  deleteComment: HandlerWithParams<{ commentId: string }, DeleteCommentReq, DeleteCommentRes>;
}

export class CommentController implements commentController {
  private db: DataStoreDao;
  constructor(db: DataStoreDao) {
    this.db = db;
  }

  createComment: HandlerWithParams<{ blogId: string }, CreateCommentReq, CreateCommentRes> = async (
    req,
    res
  ) => {
    const [userId, { content }, { blogId }] = [res.locals.userId, req.body, req.params];

    if (!content || !blogId) return res.status(404).send({ error: Errors.ALL_FIELDS_REQUIRED });
    if (!(await this.db.getBlog(blogId)))
      return res.status(404).send({ error: Errors.BLOG_NOT_FOUND });

    const user = await this.db.getUserById(userId);
    if (!user) return res.status(404).send({ error: Errors.USER_NOT_FOUND });

    const comment: Comment = {
      userId,
      content,
      blogId,
      id: crypto.randomUUID(),
      author: user.username,
      timestamp: Date.now(),
    };

    await this.db.createComment(comment);

    return res.status(200).send({ comment });
  };

  updateComment: Handler<UpdateCommentReq, UpdateCommentRes> = async (req, res) => {
    const { id, content } = req.body;
    const userId = res.locals.userId;

    if (!id || !content) return res.status(400).send({ error: Errors.ALL_FIELDS_REQUIRED });

    const comm = await this.db.getComment(id);
    if (!comm) return res.status(404).send({ error: Errors.COMMENT_NOT_FOUND });
    if (comm.userId !== userId) return res.sendStatus(403);

    comm.content = content;

    await this.db.updateComment(comm);
    return res.sendStatus(200);
  };

  deleteComment: HandlerWithParams<{ commentId: string }, DeleteCommentReq, DeleteCommentRes> =
    async (req, res) => {
      const [commentId, userId] = [req.params.commentId, res.locals.userId];

      if (!commentId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
      const commentFromDb = await this.db.getComment(commentId);
      if (!commentFromDb) return res.status(404).send({ error: Errors.COMMENT_NOT_FOUND });
      if (commentFromDb.userId !== userId) return res.sendStatus(403);

      await this.db.deleteComment(commentId);
      return res.sendStatus(200);
    };
}
