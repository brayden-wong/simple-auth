import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { CurrentUser as CurrentUsertype } from '../types';

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUsertype, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as CurrentUsertype;

    return data ? user[data] : user;
  },
);
