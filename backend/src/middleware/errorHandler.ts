import { ErrorRequestHandler } from 'express';
import { HTTP } from '../httpStatusCodes';

// todo: handle mysql errors
export const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  console.log(err.message);
  if (err.message.includes('Duplicate entry')) return res.status(HTTP.CONFLICT);
  return res.status(500).send({ error: 'Internal Server Error' });
};
