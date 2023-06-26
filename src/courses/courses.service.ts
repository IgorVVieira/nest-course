import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class CoursesService {
  constructor(
    @Inject('COURSE_REPOSITORY')
    private readonly courseRepository: Repository<Course>,
    @Inject('TAG_REPOSITORY') private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({
      relations: ['tags'],
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({
      id,
    });
    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }
    return course;
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const tags = await Promise.all(
      createCourseDto.tags.map((name) => this.preloadTagByName(name)),
    );
    return this.courseRepository.save({
      ...createCourseDto,
      tags,
    });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const tags =
      updateCourseDto.tags &&
      (await Promise.all(
        updateCourseDto.tags.map((name) => this.preloadTagByName(name)),
      ));

    const course = await this.courseRepository.preload({
      id,
      ...updateCourseDto,
      tags,
    });
    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }
    return await this.courseRepository.save(course);
  }

  async remove(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }

  private async preloadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOneBy({ name });
    if (tag) {
      return tag;
    }
    return this.tagRepository.create({ name });
  }
}
