import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response as ExpressResponse } from 'express';
import { ApiResponse } from '@nest/shared';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<ExpressResponse>();

    // Skip transformation for SSE (Server-Sent Events)
    if (request.headers.accept === 'text/event-stream') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data: any) => ({
        data: data as T,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url || '',
      })),
    );
  }
}
