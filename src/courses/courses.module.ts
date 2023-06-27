import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { courseProviders } from './course.providers';
import { tagProviders } from './tags.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CoursesController],
  providers: [CoursesService, ...courseProviders, ...tagProviders],
})
export class CoursesModule {}
