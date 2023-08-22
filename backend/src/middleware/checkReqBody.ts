import { Errors } from '@nest/shared/src/errors';
import { RequestHandler } from 'express';

export const checkEmptyInput: RequestHandler<any, any> = (req, res, next) => {
  const { body } = req;

  for (const key in body) {
    if (typeof body[key] === 'string' && body[key].trim() === '') {
      return res.status(400).send({ error: Errors.EMPTY_FIELD });
    }
  }

  next();
};
