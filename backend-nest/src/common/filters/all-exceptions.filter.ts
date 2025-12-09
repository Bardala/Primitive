import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '@nest/shared';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

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

    console.error(`\nError Response: ${JSON.stringify(errorResponse)}`);
    console.error('Exception caught:', exception);

    response.status(status).json(errorResponse);
  }
}
