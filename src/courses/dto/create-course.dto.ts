import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 3 })
  price!: number;

  @IsString()
  @IsIn(['beginner', 'intermediate', 'advanced'])
  @IsNotEmpty()
  level!: 'beginner' | 'intermediate' | 'advanced';

  @IsNotEmpty()
  @IsInt({ each: true })
  @IsArray()
  categoryIds!: number[];

  @IsNotEmpty()
  @IsInt({ each: true })
  @IsArray()
  tagIds!: number[];

  @IsNotEmpty()
  @IsInt()
  authorId!: number;
}
