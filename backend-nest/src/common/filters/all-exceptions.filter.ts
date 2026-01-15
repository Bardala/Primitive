import { ApiResponse } from '@nest/shared';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Ignore Socket.IO handshake and polling calls
    if (request?.url?.startsWith('/socket.io')) return;

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseData =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    const errorMessage =
      typeof responseData === 'string' ? responseData : (responseData as any).message;

    const errorResponse: ApiResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    };

    this.logger.error(`\nError Response: ${JSON.stringify(errorResponse)}`);
    if (status >= 500) this.logger.error('Exception caught:', exception as any);

    response.status(status).json(errorResponse);
  }
}
