import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FilterCategoryDto extends PaginationDto {
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
