import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [CoursesModule],
  providers: [TaskService],
})
export class TaskModule {}
