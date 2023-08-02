import {
  CreateSpaceReq,
  CreateSpaceRes,
  UpdateSpaceReq,
  UpdateSpaceRes,
  SpaceReq,
  SpaceRes,
  DeleteSpaceReq,
  DefaultSpaceRes,
  DefaultSpaceReq,
  JoinSpaceReq,
  JoinSpaceRes,
  AddMemberReq,
  AddMemberRes,
  MembersReq,
  MembersRes,
  Errors,
  Space,
  DeleteSpaceRes,
  SpaceMember,
  ChatReq,
  ChatRes,
} from '@nest/shared';
import { DataStoreDao } from '../dataStore';
import { HTTP } from '../httpStatusCodes';
import { Handler, HandlerWithParams } from '../types';

// *Controller
export interface spaceController {
  createSpace: Handler<CreateSpaceReq, CreateSpaceRes>;
  updateSpace: HandlerWithParams<{ spaceId: string }, UpdateSpaceReq, UpdateSpaceRes>;
  getSpace: HandlerWithParams<{ spaceId: string }, SpaceReq, SpaceRes>;
  deleteSpace: HandlerWithParams<{ spaceId: string }, DeleteSpaceReq, DefaultSpaceRes>;

  getDefaultSpace: Handler<DefaultSpaceReq, DefaultSpaceRes>;
  joinSpace: HandlerWithParams<{ spaceId: string }, JoinSpaceReq, JoinSpaceRes>;
  addMember: HandlerWithParams<{ spaceId: string }, AddMemberReq, AddMemberRes>;
  getSpaceMembers: HandlerWithParams<{ spaceId: string }, MembersReq, MembersRes>;
  getChat: HandlerWithParams<{ spaceId: string }, ChatReq, ChatRes>;
}

export class SpaceController implements spaceController {
  private db: DataStoreDao;
  constructor(db: DataStoreDao) {
    this.db = db;
  }
  getChat: HandlerWithParams<{ spaceId: string }, ChatReq, ChatRes> = async (req, res) => {
    const userId = res.locals.userId;
    const { spaceId } = req.params;

    if (!spaceId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
    if (!(await this.db.getSpace(spaceId))) return res.status(404);
    if (!(await this.db.isMember(spaceId, userId))) return res.status(403);

    const messages = await this.db.getSpaceChat(spaceId);
    return res.send({ messages });
  };

  createSpace: Handler<CreateSpaceReq, CreateSpaceRes> = async (req, res) => {
    const { description, name, status } = req.body;
    const ownerId = res.locals.userId;

    if (!description || !name || !status)
      return res.status(400).send({ error: Errors.ALL_FIELDS_REQUIRED });

    const space: Space = {
      id: crypto.randomUUID(),
      description,
      name,
      status,
      ownerId,
    };

    await this.db.createSpace(space);
    await this.db.addMember({ spaceId: space.id, memberId: ownerId, isAdmin: true });
    return res.send({ space });
  };

  updateSpace: HandlerWithParams<{ spaceId: string }, UpdateSpaceReq, UpdateSpaceRes> = async (
    req,
    res
  ) => {
    const { description, name, status } = req.body;
    const spaceId = req.params.spaceId;
    const userId = res.locals.userId;

    if (!spaceId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
    if (!description || !name || !status)
      return res.status(400).send({ error: Errors.ALL_FIELDS_REQUIRED });

    const space = await this.db.getSpace(spaceId);
    if (!space) return res.sendStatus(404);
    if (userId !== space.ownerId) return res.status(HTTP.FORBIDDEN);

    space.description = description;
    space.name = name;
    space.status = status;

    await this.db.updateSpace(space);
    return res.sendStatus(200);
  };

  getSpace: HandlerWithParams<{ spaceId: string }, SpaceReq, SpaceRes> = async (req, res) => {
    const spaceId = req.params.spaceId;
    const userId = res.locals.userId;

    if (!spaceId) return res.status(400).send({ error: Errors.PARAMS_MISSING });

    const space = await this.db.getSpace(spaceId);
    if (!space) return res.sendStatus(400);

    if (space.status === 'private' && !(await this.db.isMember(spaceId, userId))) {
      return res.status(HTTP.FORBIDDEN).send({ error: Errors.PRIVATE_SPACE });
    }

    return res.status(200).send({
      space,
      blogs: await this.db.getBlogs(spaceId),
      members: await this.db.spaceMembers(spaceId),
    });
  };

  deleteSpace: HandlerWithParams<{ spaceId: string }, DeleteSpaceReq, DeleteSpaceRes> = async (
    req,
    res
  ) => {
    const spaceId = req.params.spaceId;
    const userId = res.locals.userId;

    if (!spaceId) return res.status(400).send({ error: Errors.PARAMS_MISSING });

    const space = await this.db.getSpace(spaceId);
    if (!space) return res.sendStatus(404);
    if (space.ownerId !== userId) return res.sendStatus(403);

    await this.db.deleteSpace(spaceId);
    return res.sendStatus(200);
  };

  getDefaultSpace: Handler<DefaultSpaceReq, DefaultSpaceRes> = async (_, res) => {
    console.log('default space');
    const defaultSpace = await this.db.getSpace('1');
    if (!defaultSpace) return res.sendStatus(404);

    const blogs = await this.db.getBlogs(defaultSpace.id);

    return res.status(200).send({ space: defaultSpace, blogs });
  };

  joinSpace: HandlerWithParams<{ spaceId: string }, JoinSpaceReq, JoinSpaceRes> = async (
    req,
    res
  ) => {
    const spaceId = req.params.spaceId;
    const userId = res.locals.userId;

    if (!spaceId) return res.status(400).send({ error: Errors.PARAMS_MISSING });

    const space = await this.db.getSpace(spaceId);
    if (!space) return res.status(404).send({ error: Errors.SPACE_NOT_FOUND });
    if (space.status === 'private') return res.sendStatus(HTTP.FORBIDDEN);
    if (await this.db.isMember(spaceId, userId)) return res.sendStatus(HTTP.CONFLICT);

    await this.db.addMember({ spaceId, memberId: userId, isAdmin: false });

    const member: SpaceMember = { spaceId, memberId: userId, isAdmin: false };
    return res.send({ member });
  };

  addMember: HandlerWithParams<{ spaceId: string }, AddMemberReq, AddMemberRes> = async (
    req,
    res
  ) => {
    const [spaceId, { member, isAdmin }, userId] = [
      req.params.spaceId,
      req.body,
      res.locals.userId,
    ];

    if (!spaceId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
    if (!member || isAdmin === undefined)
      return res.status(400).send({ error: Errors.ALL_FIELDS_REQUIRED });
    const newMember =
      (await this.db.getUserByUsername(member)) || (await this.db.getUserById(member));

    if (!newMember) return res.status(404).send({ error: Errors.USER_NOT_FOUND });

    //? if not space mysql will return with error because of unique constraint on spaceId and memberId
    // const space = await this.db.getSpace(spaceId);
    // if (!space) return res.sendStatus(404);

    if (!(await this.db.isSpaceAdmin(spaceId, userId))) return res.sendStatus(403);

    //? if user is already a member, return 409, mysql wont let that happen and it will return with error
    //? because of unique constraint on spaceId and memberId: goto error handler
    // if (await this.db.isMember(spaceId, memberId)) return res.sendStatus(HTTP.CONFLICT);
    const addedMember = { spaceId, memberId: newMember.id, isAdmin };
    await this.db.addMember(addedMember);
    return res.status(200).send({ member: addedMember });
  };

  getSpaceMembers: HandlerWithParams<{ spaceId: string }, MembersReq, MembersRes> = async (
    req,
    res
  ) => {
    const [spaceId, userId] = [req.params.spaceId, res.locals.userId];

    if (!spaceId) return res.status(400).send({ error: Errors.PARAMS_MISSING });

    const space = await this.db.getSpace(spaceId);
    if (!space) return res.sendStatus(404);

    if (!(await this.db.isMember(spaceId, userId))) return res.sendStatus(403);

    const members: SpaceMember[] = await this.db.spaceMembers(spaceId);
    return res.send({ members });
  };
}
