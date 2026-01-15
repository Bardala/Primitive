import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

interface SocketErrorResponse {
  event: string;
  status: number;
  message: string;
  timestamp: string;
  data?: any;
}

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const socket = host.switchToWs().getClient<Socket>();
    const data = host.switchToWs().getData();

    const errorResponse = this.buildErrorResponse(exception, data);

    this.logger.error(`WebSocket Error [${socket.id}]: ${errorResponse.message}`, {
      event: errorResponse.event,
      status: errorResponse.status,
      userId: socket.data?.userId,
      socketId: socket.id,
    });

    // Emit error event to client
    socket.emit('ws_error', errorResponse);
  }

  private buildErrorResponse(exception: unknown, data: any): SocketErrorResponse {
    let status = 500;
    let message = 'Internal server error';
    const event = data?.event || 'unknown';

    if (exception instanceof WsException) {
      status = 400;
      const error = exception.getError();
      message = typeof error === 'string' ? error : (error as any)?.message || 'WebSocket error';
    } else if (exception instanceof BadRequestException) {
      status = 400;
      const response = exception.getResponse();
      message =
        typeof response === 'string' ? response : (response as any)?.message || 'Bad request';
    } else if (exception instanceof ForbiddenException) {
      status = 403;
      const response = exception.getResponse();
      message = typeof response === 'string' ? response : (response as any)?.message || 'Forbidden';
    } else if (exception instanceof NotFoundException) {
      status = 404;
      const response = exception.getResponse();
      message = typeof response === 'string' ? response : (response as any)?.message || 'Not found';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message =
        typeof response === 'string' ? response : (response as any)?.message || 'HTTP error';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    return {
      event,
      status,
      message,
      timestamp: new Date().toISOString(),
    };
  }
}
