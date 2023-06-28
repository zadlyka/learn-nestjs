import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
}
