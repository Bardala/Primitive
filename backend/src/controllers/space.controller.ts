import {
  AddMemberReq,
  AddMemberRes,
  CreateSpaceReq,
  CreateSpaceRes,
  DefaultSpaceReq,
  DefaultSpaceRes,
  DeleteSpaceReq,
  DeleteSpaceRes,
  JoinSpaceReq,
  JoinSpaceRes,
  MembersReq,
  MembersRes,
  SpaceReq,
  SpaceRes,
  UpdateSpaceReq,
  UpdateSpaceRes,
} from '../../../shared/src/api/space.api.types';
import { Errors } from '../../../shared/src/errors';
import { Space, SpaceMember } from '../../../shared/src/types';
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
}

export class SpaceController implements spaceController {
  private db: DataStoreDao;
  constructor(db: DataStoreDao) {
    this.db = db;
  }

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
    await this.db.addMember(space.id, ownerId);
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
      return res.sendStatus(HTTP.FORBIDDEN);
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

    await this.db.addMember(spaceId, userId);
    return res.sendStatus(200);
  };

  addMember: HandlerWithParams<{ spaceId: string }, AddMemberReq, AddMemberRes> = async (
    req,
    res
  ) => {
    const [spaceId, memberId, userId] = [req.params.spaceId, req.body.memberId, res.locals.userId];

    if (!spaceId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
    if (!memberId) return res.status(400).send({ error: Errors.ALL_FIELDS_REQUIRED });
    if (!(await this.db.getUserById(memberId)))
      return res.status(404).send({ error: Errors.USER_NOT_FOUND });

    const space = await this.db.getSpace(spaceId);
    if (!space) return res.sendStatus(404);

    if (space.ownerId !== userId) return res.sendStatus(403);
    if (await this.db.isMember(spaceId, memberId)) return res.sendStatus(HTTP.CONFLICT);

    await this.db.addMember(spaceId, memberId);
    return res.sendStatus(200);
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
