import {
  CreateCommentReq,
  CreateCommentRes,
  DeleteCommentReq,
  DeleteCommentRes,
  UpdateCommentReq,
  UpdateCommentRes,
} from "../../../shared/src/api/comment.api.types";
import { Errors } from "../../../shared/src/errors";
import { DataStoreDao } from "../dataStore";
import { Handler, HandlerWithParams } from "../types";

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

export class CommentController implements commentController {
  private db: DataStoreDao;
  constructor(db: DataStoreDao) {
    this.db = db;
  }

  createComment: Handler<CreateCommentReq, CreateCommentRes> = async (
    req,
    res,
  ) => {
    const [userId, { content, blogId }] = [res.locals.userId, req.body];

    if (!content || !blogId)
      return res.status(404).send({ error: Errors.ALL_FIELDS_REQUIRED });
    if (!(await this.db.getBlog(blogId)))
      return res.status(404).send({ error: Errors.BLOG_NOT_FOUND });

    await this.db.createComment({
      userId,
      content,
      blogId,
      id: crypto.randomUUID(),
    });

    return res.sendStatus(200);
  };

  updateComment: Handler<UpdateCommentReq, UpdateCommentRes> = async (
    req,
    res,
  ) => {
    const { id, content } = req.body;
    const userId = res.locals.userId;

    if (!id || !content)
      return res.status(400).send({ error: Errors.ALL_FIELDS_REQUIRED });

    const comm = await this.db.getComment(id);
    if (!comm) return res.status(404).send({ error: Errors.COMMENT_NOT_FOUND });
    if (comm.userId !== userId) return res.sendStatus(403);

    comm.content = content;

    await this.db.updateComment(comm);
    return res.sendStatus(200);
  };

  deleteComment: HandlerWithParams<
    { commentId: string },
    DeleteCommentReq,
    DeleteCommentRes
  > = async (req, res) => {
    const [commentId, userId] = [req.params.commentId, res.locals.userId];

    if (!commentId)
      return res.status(400).send({ error: Errors.PARAMS_MISSING });
    const commentFromDb = await this.db.getComment(commentId);
    if (!commentFromDb)
      return res.status(404).send({ error: Errors.COMMENT_NOT_FOUND });
    if (commentFromDb.userId !== userId) return res.sendStatus(403);

    await this.db.deleteComment(commentId);
    return res.sendStatus(200);
  };
}
