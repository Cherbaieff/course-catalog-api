import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('courses/:courseId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(courseId, createReviewDto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.reviewsService.findOne(id, courseId);
  }

  @Get()
  findAll(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.reviewsService.findAll(courseId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, courseId, updateReviewDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.reviewsService.remove(id, courseId);
  }
}
