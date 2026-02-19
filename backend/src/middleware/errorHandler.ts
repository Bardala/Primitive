import { ErrorRequestHandler } from 'express';

import { HTTP } from '../httpStatusCodes';

// todo: handle mysql errors
export const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  console.log('Error: ', err.message, '\nStack: ', err.stack);

  if (err.message.includes('Duplicate entry')) return res.sendStatus(HTTP.CONFLICT);
  return res.status(500).send({ error: 'Internal Server Error' });
};
