import { SetMetadata } from '@nestjs/common';
import { Permission } from '../../role/enums/permission.enum';

export const PERMISSION_KEY = 'permission';
export const RequiredPermission = (permission: Permission) =>
  SetMetadata(PERMISSION_KEY, permission);
