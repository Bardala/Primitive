import { ERROR } from '@nest/shared';
import { RequestHandler } from 'express';
import jwt, { JwtPayload, TokenExpiredError, VerifyErrors } from 'jsonwebtoken';
import { pbkdf2Sync } from 'node:crypto';

import { db } from '../dataStore';
import { HTTP } from '../httpStatusCodes';

export const requireAuth: RequestHandler<any, any> = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: ERROR.UNAUTHORIZED });

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, generateJwtSecret()) as JwtPayload;
  } catch (err) {
    const verifyError = err as VerifyErrors;
    if (verifyError instanceof TokenExpiredError) {
      return res.status(HTTP.UNAUTHORIZED).send({ error: ERROR.TOKEN_EXPIRED });
    }
    return res.status(HTTP.UNAUTHORIZED).send({ error: ERROR.INVALID_TOKEN });
  }

  const user = await db.getUserById(payload.id);
  if (!user) return res.status(HTTP.UNAUTHORIZED).send({ error: ERROR.INVALID_TOKEN });

  res.locals.userId = user.id;

  return next();
};

export function generateJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('Missing jwt secret');
    process.exit(1);
  }
  return secret;
}

export function hashPassword(password: string): string {
  return pbkdf2Sync(password, generateJwtSecret()!, 20, 20, 'sha512').toString('hex');
}

export function createToken(id: string): string {
  return jwt.sign({ id }, generateJwtSecret()!, { expiresIn: '45d' });
}
