import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): any => {
  const request = ctx.switchToHttp().getRequest<Request & { user: any }>();
  return request.user;
});
