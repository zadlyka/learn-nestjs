import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Permission } from '../enums/permission.enum';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  readonly name: string;

  @IsEnum(Permission, { each: true })
  @IsNotEmpty()
  readonly permissions: Permission[];
}
