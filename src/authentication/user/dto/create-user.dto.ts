import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Role } from '../../role/entities/role.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(64)
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @MaxLength(64)
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MaxLength(8)
  @IsString()
  readonly password: string;

  @IsUUID()
  @IsString()
  readonly profileId?: string;

  @IsUUID()
  @IsString()
  readonly identityCardId?: string;

  @Type(() => Role)
  @ValidateNested()
  readonly roles: Role[];
}
