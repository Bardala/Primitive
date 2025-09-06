import { RequestHandler } from 'express';

import { logger } from '../utils';

export const flagSlowReq: RequestHandler<any, any> = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000; // nanoseconds → ms

    const msg = `${req.method} ${req.originalUrl} - ${res.statusCode} [${durationMs.toFixed(
      2
    )} ms]`;

    if (durationMs > 2000) {
      // > 2 seconds considered slow
      logger.warn(`SLOW REQUEST: ${msg}`);
    } else {
      logger.info(msg);
    }
  });

  next();
};
