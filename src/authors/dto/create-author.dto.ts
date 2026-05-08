import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
