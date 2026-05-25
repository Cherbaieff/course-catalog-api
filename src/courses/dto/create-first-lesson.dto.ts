import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFirstLessonDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsNumber()
  duration!: number;

  @IsNotEmpty()
  @IsInt()
  order!: number;
}
