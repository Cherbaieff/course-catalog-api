import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [PrismaModule, CoursesModule],
  providers: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
