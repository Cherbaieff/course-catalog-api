import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prismaService: PrismaService) {}

  private async findExistingCourse(id: number) {
    const course = await this.prismaService.course.findUnique({
      where: { id },
      include: {
        tags: true,
        categories: true,
        author: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`The course with an of ${id} is not found`);
    }

    return course;
  }

  async findAll() {
    return this.prismaService.course.findMany({
      include: {
        tags: true,
        categories: true,
        author: true,
      },
    });
  }

  async findOne(id: number) {
    return this.findExistingCourse(id);
  }

  async create(createCourseDto: CreateCourseDto) {
    return this.prismaService.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        price: createCourseDto.price,
        level: createCourseDto.level,
        authorId: createCourseDto.authorId,

        categories: {
          connect: createCourseDto.categoryIds.map((id) => ({ id })),
        },
        tags: {
          connect: createCourseDto.tagIds.map((id) => ({ id })),
        },
      },
      include: {
        categories: true,
        tags: true,
        author: true,
      },
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    await this.findExistingCourse(id);

    const { categoryIds, tagIds, ...courseData } = updateCourseDto;

    return this.prismaService.course.update({
      where: { id },
      data: {
        ...courseData,
        ...(categoryIds && {
          categories: {
            set: categoryIds.map((id) => ({ id })),
          },
        }),
        ...(tagIds && {
          tags: {
            set: tagIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        tags: true,
        categories: true,
        author: true,
      },
    });
  }

  async delete(id: number) {
    await this.findExistingCourse(id);

    return this.prismaService.course.delete({
      where: { id },
    });
  }
}
