import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCoursesDto } from './dto/filter-courses.dto';
import { QueryMode } from 'generated/prisma/internal/prismaNamespace';

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

  private async filteredCourses({
    search,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    page,
    limit,
    level,
    authorId,
  }: FilterCoursesDto) {
    if (minPrice && maxPrice && minPrice > maxPrice) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    const whereClause = {
      ...(search && {
        title: { contains: search, mode: QueryMode.insensitive },
      }),
      ...(level && { level }),
      ...(authorId && { authorId }),
      ...((minPrice || maxPrice) && {
        price: {
          lte: maxPrice,
          gte: minPrice,
        },
      }),
    };

    const [courses, coursesRecords] = await Promise.all([
      this.prismaService.course.findMany({
        where: whereClause,
        include: {
          tags: true,
          author: true,
          categories: true,
        },
        orderBy: { [sortBy || 'createdAt']: sortOrder || 'asc' },
        ...(page &&
          limit && {
            skip: (page - 1) * limit,
            take: limit,
          }),
      }),
      this.prismaService.course.count({ where: whereClause }),
    ]);

    return {
      data: courses,
      count: coursesRecords,
      page: page || 1,
      limit: limit || 10,
    };
  }

  async findAll(query: FilterCoursesDto) {
    return await this.filteredCourses(query);
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
