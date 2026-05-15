import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CoursesService } from 'src/courses/courses.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly coursesService: CoursesService,
  ) {}

  private async findExistingCourse(courseId: number) {
    return this.coursesService.findOne(courseId);
  }

  private async findExistingLesson(id: number) {
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      throw new NotFoundException(`The lesson of id ${id} is not found`);
    }

    return lesson;
  }

  async create(courseId: number, createLessonDto: CreateLessonDto) {
    await this.findExistingCourse(courseId);

    return this.prismaService.lesson.create({
      data: {
        ...createLessonDto,
        courseId: courseId,
      },
    });
  }

  async findOne(courseId: number, id: number) {
    await this.findExistingCourse(courseId);

    return this.findExistingLesson(id);
  }

  async findAll(courseId: number) {
    return this.prismaService.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }

  async update(courseId: number, id: number, updateLessonDto: UpdateLessonDto) {
    await this.findExistingCourse(courseId);
    await this.findExistingLesson(id);

    return this.prismaService.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  async delete(courseId: number, id: number) {
    await this.findExistingCourse(courseId);
    await this.findExistingLesson(id);

    return this.prismaService.lesson.delete({
      where: { id },
    });
  }
}
