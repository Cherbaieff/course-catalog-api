import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  text!: string;

  @IsNotEmpty()
  @IsIn([1, 2, 3, 4, 5])
  @IsInt()
  rating!: number;
}
