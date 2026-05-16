import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [PrismaModule, CoursesModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
