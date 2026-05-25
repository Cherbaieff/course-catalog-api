import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateFirstLessonDto } from './create-first-lesson.dto';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFirstLessonDto)
  firstLesson!: CreateFirstLessonDto;
}
