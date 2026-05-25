import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class TaskService {
  constructor(private readonly coursesService: CoursesService) {}

  @Cron('*/10 * * * * *')
  async logCoursesCount() {
    const courses = await this.coursesService.findAll();
    console.log(`The amount of courses at the moment is ${courses.count}`);
  }
}
