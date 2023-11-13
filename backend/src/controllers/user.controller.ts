import {
  AllUnReadMsgsReq,
  AllUnReadMsgsRes,
  ERROR,
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
  PageSize,
  SignUpReq,
  UnFollowUserReq,
  UnFollowUserRes,
  UserBlogsReq,
  UserBlogsRes,
  UserSpacesReq,
  UserSpacesRes,
} from '@nest/shared';
import { getRandomValues, randomUUID } from 'node:crypto';
import validator from 'validator';

import { DataStoreDao } from '../dataStore';
import { HTTP } from '../httpStatusCodes';
import { createToken, hashPassword } from '../middleware/authMiddleware';
import { Handler, HandlerWithParams } from '../types';

export interface userController {
  signup: Handler<SignUpReq, LoginRes>;
  login: Handler<LoginReq, LoginRes>;
  getUsersList: Handler<GetUsersListReq, GetUsersListRes>;
  getUserCard: HandlerWithParams<{ id: string }, GetUserCardReq, GetUserCardRes>;
  createFollow: HandlerWithParams<{ id: string }, FollowUserReq, FollowUserRes>;
  deleteFollow: HandlerWithParams<{ id: string }, UnFollowUserReq, UnFollowUserRes>;
  getFollowers: HandlerWithParams<{ id: string }, GetFollowersReq, GetFollowersRes>;
  getUserBlogs: HandlerWithParams<{ id: string }, UserBlogsReq, UserBlogsRes>;
  getUserSpaces: HandlerWithParams<{ id: string }, UserSpacesReq, UserSpacesRes>;
  getAllUnReadMsgs: Handler<AllUnReadMsgsReq, AllUnReadMsgsRes>;
}

export class UserController implements userController {
  private db: DataStoreDao;

  constructor(db: DataStoreDao) {
    this.db = db;
  }

  getAllUnReadMsgs: Handler<AllUnReadMsgsReq, AllUnReadMsgsRes> = async (_, res) => {
    return res.send({
      numberOfMsgs: await this.db.numOfAllUnReadMsgs(res.locals.userId),
    });
  };

  getUserSpaces: HandlerWithParams<{ id: string }, UserSpacesReq, UserSpacesRes> = async (
    req,
    res
  ) => {
    const userId = req.params.id;
    if (!userId) {
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.PARAMS_MISSING });
    }

    return res.status(HTTP.OK).send({ spaces: await this.db.getUserSpaces(userId) });
  };

  getUserBlogs: HandlerWithParams<{ id: string; page: string }, UserBlogsReq, UserBlogsRes> =
    async (req, res) => {
      const userId = req.params.id;
      if (!userId || !req.params.page) {
        return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.PARAMS_MISSING });
      }

      const page = parseInt(req.params.page);
      const pageSize = PageSize;

      const offset = (page - 1) * pageSize;
      const blogs = await this.db.getUserBlogs(userId, pageSize, offset);

      return res.send({ blogs, page });
    };

  getUserCard: HandlerWithParams<{ id: string }, GetUserCardReq, GetUserCardRes> = async (
    req,
    res
  ) => {
    if (!req.params.id) {
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.PARAMS_MISSING });
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
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.PARAMS_MISSING });
    }
    if (!(await this.db.getUserById(req.params.id)))
      return res.status(HTTP.NOT_FOUND).send({ error: ERROR.USER_NOT_FOUND });

    if (await this.db.isFollow(req.params.id, res.locals.userId)) {
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.ALREADY_FOLLOWER });
    }

    await this.db.createFollow(res.locals.userId, req.params.id);
    return res.sendStatus(HTTP.OK);
  };

  deleteFollow: HandlerWithParams<{ id: string }, UnFollowUserReq, UnFollowUserRes> = async (
    req,
    res
  ) => {
    if (!req.params.id) {
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.PARAMS_MISSING });
    }

    // todo check Is already an unfollower
    if (!(await this.db.isFollow(req.params.id, res.locals.userId))) {
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.ALREADY_UNFOLLOWER });
    }

    await this.db.deleteFollow(res.locals.userId, req.params.id);
    return res.sendStatus(200);
  };

  getFollowers: HandlerWithParams<{ id: string }, GetFollowersReq, GetFollowersRes> = async (
    req,
    res
  ) => {
    if (!req.params.id) {
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.PARAMS_MISSING });
    }

    if (!(await this.db.getUserById(req.params.id)))
      return res.status(HTTP.NOT_FOUND).send({ error: ERROR.USER_NOT_FOUND });

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
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.ALL_FIELDS_REQUIRED });

    if (await this.db.getUserByEmail(email))
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.DUPLICATE_EMAIL });
    if (await this.db.getUserByUsername(username))
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.DUPLICATE_USERNAME });

    if (!this.isVALID_USERNAME(username))
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.INVALID_USERNAME });
    if (!validator.isEmail(email))
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.INVALID_EMAIL });
    if (!validator.isStrongPassword(password))
      return res.status(HTTP.BAD_REQUEST).send({
        error:
          ERROR.WEAK_PASSWORD + '. Suggested strong password: ' + this.generateStrongPassword(),
      });

    const user = {
      email,
      username,
      id: randomUUID() as string,
      password: hashPassword(password),
      timestamp: Date.now(),
    };

    await this.db.createUser(user);
    await this.db.addMember({ spaceId: this.db.defaultSpcId, memberId: user.id, isAdmin: false });

    return res.send({ jwt: createToken(user.id), username: user.username, id: user.id });
  };

  login: Handler<LoginReq, LoginRes> = async (req, res) => {
    if (!req.body.login || !req.body.password)
      return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.ALL_FIELDS_REQUIRED });

    const user =
      (await this.db.getUserByEmail(req.body.login)) ||
      (await this.db.getUserByUsername(req.body.login));

    if (!user) return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.INVALID_LOGIN });

    const match = user.password === hashPassword(req.body.password);
    if (!match) return res.status(HTTP.BAD_REQUEST).send({ error: ERROR.INVALID_PASSWORD });

    return res
      .status(200)
      .send({ jwt: createToken(user.id), username: user.username, id: user.id });
  };

  generateStrongPassword = (): string => {
    const passwordLength = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let retVal = '';
    while (!validator.isStrongPassword(retVal)) {
      retVal = '';
      for (let i = 0, n = charset.length; i < passwordLength; ++i)
        retVal +=
          charset[Math.floor((getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * n)];
    }

    return retVal;
  };
}
