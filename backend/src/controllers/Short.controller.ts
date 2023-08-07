interface ShController {
  // createShort: HandlerWithParams<{ spaceId: string }, CreateShortReq, CreateShortRes>;
  // updateShort: HandlerWithParams<{ shortId: string }, UpdateShortReq, UpdateShortRes>;
  // deleteShort: HandlerWithParams<{ shortId: string }, DeleteShortReq, DeleteShortRes>;
  // getShort: HandlerWithParams<{ shortId: string; spaceId: string }, GetShortReq, GetShortRes>;
  // shortComments: HandlerWithParams<{ shortId: string }, ShortCommentsReq, ShortCommentsRes>;
}

export class ShortController implements ShController {
  // private db: SqlDataStore;
  // constructor(db: SqlDataStore) {
  //   this.db = db;
  // }
  // shortComments: HandlerWithParams<{ shortId: string }, ShortCommentsReq, ShortCommentsRes> =
  //   async (req, res) => {
  //     const { shortId } = req.params;
  //     if (!shortId) return res.status(400).send({ error: Errors.PARAMS_MISSING });
  //     const comments = await this.db.getShComments(shortId);
  //     return res.send({ comments });
  //   };
  // createShort: HandlerWithParams<{ spaceId: string }, CreateShortReq, CreateShortRes> = async (
  //   req,
  //   res
  // ) => {
  //   const [userId, spaceId] = [res.locals.userId, req.params.spaceId];
  //   const { title, content } = req.body;
  //   console.log(userId, spaceId, title, content);
  //   if (!spaceId) return res.status(400).json({ error: Errors.PARAMS_MISSING });
  //   if (!title || !content) return res.status(400).json({ error: Errors.ALL_FIELDS_REQUIRED });
  //   if (!(await this.db.isMember(spaceId, userId))) return res.sendStatus(409);
  //   const short: Short = {
  //     title,
  //     content,
  //     userId,
  //     spaceId,
  //     id: crypto.randomUUID(),
  //     timestamp: Date.now(),
  //     author: (await this.db.getUserById(userId))?.username,
  //   };
  //   await this.db.createShort(short);
  //   return res.send({ short });
  // };
  // updateShort: HandlerWithParams<{ shortId: string }, UpdateShortReq, UpdateShortRes> = async (
  //   req,
  //   res
  // ) => {
  //   const [userId, shortId] = [res.locals.userId, req.params.shortId];
  //   const { title, content } = req.body;
  //   if (!shortId) return res.status(400).json({ error: Errors.PARAMS_MISSING });
  //   if (!title || !content) return res.status(400).json({ error: Errors.ALL_FIELDS_REQUIRED });
  //   let short = await this.db.getShort(shortId);
  //   if (!short) return res.status(404).json({ error: Errors.SHORT_NOT_FOUND });
  //   if (short.userId !== userId) return res.sendStatus(403);
  //   short = {
  //     id: shortId,
  //     title,
  //     content,
  //     userId,
  //     spaceId: short.spaceId,
  //   };
  //   await this.db.updateShort(short);
  //   return res.send({ short });
  // };
  // deleteShort: HandlerWithParams<{ shortId: string }, DeleteShortReq, DeleteShortRes> = async (
  //   req,
  //   res
  // ) => {
  //   const [userId, shortId] = [res.locals.userId, req.params.shortId];
  //   if (!shortId) return res.status(400).json({ error: Errors.PARAMS_MISSING });
  //   const short = await this.db.getShort(shortId);
  //   if (!short) return res.status(404).json({ error: Errors.SHORT_NOT_FOUND });
  //   if (short.userId !== userId) return res.sendStatus(403);
  //   await this.db.deleteShort(shortId);
  //   return res.sendStatus(200);
  // };
  // getShort: HandlerWithParams<{ shortId: string }, GetShortReq, GetShortRes> = async (req, res) => {
  //   const [userId, { shortId }] = [res.locals.userId, req.params];
  //   if (!shortId) return res.status(400).json({ error: Errors.PARAMS_MISSING });
  //   const short = await this.db.getShort(shortId);
  //   if (!short) return res.status(404).json({ error: Errors.SHORT_NOT_FOUND });
  //   if (
  //     !(await this.db.isMember(short.spaceId, userId)) &&
  //     (await this.db.getSpace(short.spaceId))?.status === 'private'
  //   )
  //     return res.status(403).send({ error: Errors.PRIVATE_SHORT });
  //   return res.send({ short });
  // };
}
