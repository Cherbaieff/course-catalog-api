import { IsOptional, IsString, IsIn } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FilterTagDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['name', 'createdAt'])
  @IsString()
  sortBy?: 'name' | 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
