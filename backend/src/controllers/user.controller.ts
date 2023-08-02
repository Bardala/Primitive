import crypto from 'crypto';
import validator from 'validator';

import {
  FollowUserReq,
  FollowUserRes,
  GetFollowersReq,
  GetFollowersRes,
  GetUserCardReq,
  GetUserCardRes,
  GetUsersListReq,
  GetUsersListRes,
  LoginReq,
  LoginRes,
  SignUpReq,
  UnFollowUserReq,
  UnFollowUserRes,
  UserBlogsReq,
  UserBlogsRes,
  UserSpacesReq,
  UserSpacesRes,
} from '../../../shared/src/api/user.api.types';
import { Errors } from '../../../shared/src/errors';
import { SqlDataStore } from '../dataStore/sql/SqlDataStore.class';
import { HTTP } from '../httpStatusCodes';
import { createToken, hashPassword } from '../middleware/authMiddleware';
import { Handler, HandlerWithParams } from '../types';

export interface userController {
  signup: Handler<SignUpReq, LoginRes>;
  login: Handler<LoginReq, LoginRes>;
  getUsersList: Handler<GetUserCardReq, GetUserCardRes>;
  getUserCard: HandlerWithParams<{ id: string }, GetUserCardReq, GetUserCardRes>;
  createFollow: HandlerWithParams<{ id: string }, FollowUserReq, FollowUserRes>;
  deleteFollow: HandlerWithParams<{ id: string }, UnFollowUserReq, UnFollowUserRes>;
  getFollowers: HandlerWithParams<{ id: string }, GetFollowersReq, GetFollowersRes>;
  getUserBlogs: HandlerWithParams<{ id: string }, UserBlogsReq, UserBlogsRes>;
  getUserSpaces: HandlerWithParams<{ id: string }, UserSpacesReq, UserSpacesRes>;
}

export class UserController implements userController {
  private db: SqlDataStore;

  constructor(db: SqlDataStore) {
    this.db = db;
  }

  getUserSpaces: HandlerWithParams<{ id: string }, UserSpacesReq, UserSpacesRes> = async (
    req,
    res
  ) => {
    const userId = req.params.id;
    if (!userId) {
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.PARAMS_MISSING });
    }

    return res.status(HTTP.OK).send({ spaces: await this.db.getUserSpaces(userId) });
  };

  getUserBlogs: HandlerWithParams<{ id: string }, UserBlogsReq, UserBlogsRes> = async (
    req,
    res
  ) => {
    const userId = req.params.id;
    if (!userId) {
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.PARAMS_MISSING });
    }

    return res.status(HTTP.OK).send({ blogs: await this.db.getUserBlogs(userId) });
  };

  getUserCard: HandlerWithParams<{ id: string }, GetUserCardReq, GetUserCardRes> = async (
    req,
    res
  ) => {
    if (!req.params.id) {
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.PARAMS_MISSING });
    }

    return res.status(HTTP.OK).send({
      userCard: await this.db.getUserCard(res.locals.userId, req.params.id),
    });
  };

  createFollow: HandlerWithParams<{ id: string }, FollowUserReq, FollowUserRes> = async (
    req,
    res
  ) => {
    if (!req.params.id) {
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.PARAMS_MISSING });
    }
    if (!(await this.db.getUserById(req.params.id)))
      return res.status(HTTP.NOT_FOUND).send({ error: Errors.USER_NOT_FOUND });

    if (await this.db.isFollow(req.params.id, res.locals.userId)) {
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.ALREADY_FOLLOWER });
    }

    await this.db.createFollow(res.locals.userId, req.params.id);
    return res.sendStatus(HTTP.OK);
  };

  deleteFollow: HandlerWithParams<{ id: string }, UnFollowUserReq, UnFollowUserRes> = async (
    req,
    res
  ) => {
    if (!req.params.id) {
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.PARAMS_MISSING });
    }

    // todo check Is already an unfollower
    if (!(await this.db.isFollow(req.params.id, res.locals.userId))) {
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.ALREADY_UNFOLLOWER });
    }

    await this.db.deleteFollow(res.locals.userId, req.params.id);
    return res.sendStatus(200);
  };

  getFollowers: HandlerWithParams<{ id: string }, GetFollowersReq, GetFollowersRes> = async (
    req,
    res
  ) => {
    if (!req.params.id) {
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.PARAMS_MISSING });
    }

    if (!(await this.db.getUserById(req.params.id)))
      return res.status(HTTP.NOT_FOUND).send({ error: Errors.USER_NOT_FOUND });

    return res.status(200).send({ followers: await this.db.getFollowers(req.params.id) });
  };

  getUsersList: Handler<GetUsersListReq, GetUsersListRes> = async (_req, res) => {
    return res.status(HTTP.OK).send({ usersList: await this.db.getUsersList() });
  };

  private isVALID_USERNAME = (username: string) => {
    return (
      validator.isAlphanumeric(username) &&
      username.length >= 3 &&
      username.length <= 20 &&
      validator.isAlpha(username[0])
    );
  };

  signup: Handler<SignUpReq, LoginRes> = async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password)
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.ALL_FIELDS_REQUIRED });

    if (await this.db.getUserByEmail(email))
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.DUPLICATE_EMAIL });
    if (await this.db.getUserByUsername(username))
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.DUPLICATE_USERNAME });

    if (!this.isVALID_USERNAME(username))
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.INVALID_USERNAME });
    if (!validator.isEmail(email))
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.INVALID_EMAIL });
    if (!validator.isStrongPassword(password))
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.WEAK_PASSWORD });

    const user = {
      email,
      username,
      id: crypto.randomUUID() as string,
      password: hashPassword(password),
    };

    await this.db.createUser(user);
    await this.db.addMember({ spaceId: this.db.defaultSpcId, memberId: user.id, isAdmin: false });

    return res.send({ jwt: createToken(user.id), username: user.username, id: user.id });
  };

  login: Handler<LoginReq, LoginRes> = async (req, res) => {
    if (!req.body.login || !req.body.password)
      return res.status(HTTP.BAD_REQUEST).send({ error: Errors.ALL_FIELDS_REQUIRED });

    const user =
      (await this.db.getUserByEmail(req.body.login)) ||
      (await this.db.getUserByUsername(req.body.login));

    if (!user) return res.status(HTTP.BAD_REQUEST).send({ error: Errors.INVALID_LOGIN });

    const match = user.password === hashPassword(req.body.password);
    if (!match) return res.status(HTTP.BAD_REQUEST).send({ error: Errors.INVALID_PASSWORD });

    return res
      .status(200)
      .send({ jwt: createToken(user.id), username: user.username, id: user.id });
  };
}
