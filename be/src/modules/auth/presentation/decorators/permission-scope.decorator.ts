import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PermissionScope = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.permissionScope ?? 'all';
  },
);
