import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(64)
  @IsString()
  name: string;

  @IsNotEmpty()
  @MaxLength(64)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(8)
  @IsString()
  password: string;
}
