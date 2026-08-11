import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permission';
export const Permissions = (permission: string) =>
  SetMetadata(PERMISSIONS_KEY, permission);
