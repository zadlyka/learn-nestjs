import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';
import { Permission } from '../../role/enums/permission.enum';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  protected evaluatePermission(user: User, permission: Permission) {
    const userPermissions = user.roles.reduce(
      (agg, roles) => agg.concat(roles.permissions),
      [],
    );

    const allowedPermissions = [
      Permission.ManageAll,
      Math.round(permission / 100) * 100, // MANAGE at actions group level
      permission,
    ];

    return allowedPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async isOwner(user: User, id: string) {
    return false;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user, params } = context.switchToHttp().getRequest();
    const { id = '' } = params;
    const isOwner = await this.isOwner(user, id);
    if (isOwner) return true;
    return this.evaluatePermission(user, requiredPermissions);
  }
}
