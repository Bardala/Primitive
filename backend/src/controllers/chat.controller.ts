import {
  ChatMessage,
  CreateMsgReq,
  CreateMsgRes,
  DeleteBlogRes,
  DeleteMsgReq,
  ERROR,
} from '@nest/shared';
import { randomUUID } from 'node:crypto';

import { DataStoreDao } from '../dataStore';
import { HandlerWithParams } from '../types';

interface chatController {
  createMessage: HandlerWithParams<{ spaceId: string }, CreateMsgReq, CreateMsgRes>;
  deleteMessage: HandlerWithParams<{ msgId: string }, DeleteMsgReq, DeleteBlogRes>;
}

export class ChatController implements chatController {
  private db: DataStoreDao;
  constructor(db: DataStoreDao) {
    this.db = db;
  }

  createMessage: HandlerWithParams<{ spaceId: string }, CreateMsgReq, CreateMsgRes> = async (
    req,
    res
  ) => {
    const { userId } = res.locals;
    const { spaceId } = req.params;
    const { content } = req.body;

    if (!spaceId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });
    if (!content) return res.status(400).send({ error: ERROR.EMPTY_FIELD });
    if (!(await this.db.isMember(spaceId, userId))) return res.status(403);

    //? I think that I shouldn't ensure does space exist here,
    //? because it will be checked in the database as a foreign key
    const user = await this.db.getUserById(userId);
    const msg: ChatMessage = {
      spaceId,
      userId,
      content,
      timestamp: Date.now(),
      id: randomUUID(),
      username: user?.username!,
    };
    await this.db.createMessage(msg);
    return res.send({ message: msg });
  };

  deleteMessage: HandlerWithParams<{ msgId: string }, DeleteMsgReq, DeleteBlogRes> = async (
    req,
    res
  ) => {
    const { userId } = res.locals;
    const { msgId } = req.params;

    if (!msgId) return res.status(400).send({ error: ERROR.PARAMS_MISSING });

    const msg = await this.db.getMessage(msgId);
    if (!msg) return res.sendStatus(404);
    if (msg.userId !== userId) return res.sendStatus(403);

    await this.db.deleteMessage(msgId);
    return res.sendStatus(200);
  };
}
