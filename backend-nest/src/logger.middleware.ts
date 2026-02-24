import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './common/services/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private loggerService: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { ip, method, originalUrl, query, body } = request;
    const userAgent = request.get('user-agent') || '';
    const userId = request.user?.['id'] || (request as any).userId;

    // Log when response is finished
    response.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = response;

      // Only log non-socket.io endpoints
      if (!originalUrl.includes('/socket.io')) {
        this.loggerService.logRequest({
          timestamp: new Date().toISOString(),
          method,
          url: originalUrl,
          statusCode,
          responseTime,
          ip: ip || 'unknown',
          userAgent,
          userId,
          body: method !== 'GET' && method !== 'DELETE' ? body : undefined,
          query: Object.keys(query || {}).length > 0 ? query : undefined,
        });
      }
    });

    next();
  }
}
