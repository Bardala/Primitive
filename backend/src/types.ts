import { RequestHandler } from 'express';
// todo: rename the file .d.ts

type WithError<T> = T & { error: string };

export type Handler<Req, Res> = RequestHandler<string, Partial<WithError<Res>>, Partial<Req>, any>;

export type HandlerWithParams<Params, Req, Res> = RequestHandler<
  Partial<Params>,
  Partial<WithError<Res>>,
  Partial<Req>
>;

export interface JwtObj {
  userId: string;
}
