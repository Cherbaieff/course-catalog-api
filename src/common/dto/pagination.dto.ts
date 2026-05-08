import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  limit?: number = 10;
}
