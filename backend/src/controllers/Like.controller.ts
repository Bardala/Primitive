import {
  ERROR,
  GetPostLikesReq,
  GetPostLikesRes,
  LikePostReq,
  LikePostRes,
  UnLikePostReq,
  UnLikePostRes,
} from '@nest/shared';
import { HandlerWithParams } from '../types';
import { SqlDataStore } from '../dataStore/sql/SqlDataStore.class';
import { DataStoreDao } from '../dataStore';

interface likeController {
  likePost: HandlerWithParams<{ postId: string }, LikePostReq, LikePostRes>;
  unLikePost: HandlerWithParams<{ postId: string }, UnLikePostReq, UnLikePostRes>;
  getPostLikes: HandlerWithParams<{ postId: string }, GetPostLikesReq, GetPostLikesRes>;
}

export class LikeController implements likeController {
  private db: DataStoreDao;
  constructor(db: SqlDataStore) {
    this.db = db;
  }

  unLikePost: HandlerWithParams<{ postId: string }, UnLikePostReq, UnLikePostRes> = async (
    req,
    res
  ) => {
    const [{ postId }, { userId }] = [req.params, res.locals];
    if (!postId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
    await this.db.removeLike({ blogId: postId, userId });
    return res.sendStatus(200);
  };
  getPostLikes: HandlerWithParams<{ postId: string }, GetPostLikesReq, GetPostLikesRes> = async (
    req,
    res
  ) => {
    const [{ postId }] = [req.params];
    if (!postId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
    const likes = await this.db.getPostLikes(postId);
    return res.status(200).send({ users: likes });
  };

  likePost: HandlerWithParams<{ postId: string }, LikePostReq, LikePostRes> = async (req, res) => {
    const [{ postId }, { userId }] = [req.params, res.locals];
    if (!postId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
    await this.db.createLike({ blogId: postId, userId });
    return res.sendStatus(200);
  };
}
