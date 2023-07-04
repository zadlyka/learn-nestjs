import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateAttachmentDto {
  @IsNotEmpty()
  @MaxLength(64)
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @MaxLength(64)
  @IsString()
  readonly mimetype: string;

  @IsNotEmpty()
  @IsNumber()
  readonly size: number;

  @IsNotEmpty()
  @IsString()
  readonly url: string;
}
