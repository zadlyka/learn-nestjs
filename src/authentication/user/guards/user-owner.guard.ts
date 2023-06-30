import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserOwnerGuard extends PermissionsGuard {
  constructor(private readonly userService: UserService, reflector: Reflector) {
    super(reflector);
  }

  protected async isOwner(user: User, id: string) {
    try {
      const data = await this.userService.findOne(id);
      return user.id === data.id;
    } catch (error) {}
    return false;
  }
}
