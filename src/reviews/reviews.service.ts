import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CoursesService } from 'src/courses/courses.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly prismaService: PrismaService,
  ) {}

  private async findExistingReview(id: number) {
    const review = await this.prismaService.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(
        `The review with the id of ${id} is not found`,
      );
    }

    return review;
  }

  async create(courseId: number, createReviewDto: CreateReviewDto) {
    await this.coursesService.findOne(courseId);

    return this.prismaService.review.create({
      data: { ...createReviewDto, courseId: courseId },
    });
  }

  async findAll(courseId: number) {
    return this.prismaService.review.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, courseId: number) {
    await this.coursesService.findOne(courseId);

    return this.findExistingReview(id);
  }

  async update(id: number, courseId: number, updateReviewDto: UpdateReviewDto) {
    await this.coursesService.findOne(courseId);
    await this.findExistingReview(id);

    return this.prismaService.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  async remove(id: number, courseId: number) {
    await this.coursesService.findOne(courseId);
    await this.findExistingReview(id);

    return this.prismaService.review.delete({ where: { id } });
  }
}
