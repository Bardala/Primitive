import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/modules/user/entities/user.entity';

export const GetUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest<Request & { user: User }>();
  return request.user as User;
});
