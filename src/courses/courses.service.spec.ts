import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tag.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let courseRepository: Repository<Course>;
  let tagRepository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
      ],
    }).compile();

    coursesService = module.get<CoursesService>(CoursesService);
    courseRepository = module.get<Repository<Course>>(
      getRepositoryToken(Course),
    );
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const expectedResult = [new Course(), new Course()];
      jest.spyOn(courseRepository, 'find').mockResolvedValue(expectedResult);

      const result = await coursesService.findAll();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a course with the given id', async () => {
      const courseId = 'id';
      const expectedCourse = new Course();
      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(expectedCourse);

      const result = await coursesService.findOne(courseId);

      expect(result).toEqual(expectedCourse);
    });

    it('should throw NotFoundException if course is not found', async () => {
      const courseId = 'id';
      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(undefined);

      await expect(coursesService.findOne(courseId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new course with the provided data', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Test Course',
        description: 'Test Description',
        tags: ['tag1', 'tag2'],
      };
      const expectedTags = [new Tag(), new Tag()];
      jest.spyOn(tagRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(tagRepository, 'create').mockReturnValue(new Tag());
      jest.spyOn(courseRepository, 'save').mockResolvedValue(new Course());

      const result = await coursesService.create(createCourseDto);

      expect(result.name).toBe(createCourseDto.name);
      expect(result.description).toBe(createCourseDto.description);
      expect(result.tags).toEqual(expectedTags);
    });
  });

  describe('update', () => {
    it('should update a course with the provided data', async () => {
      const courseId = 'id';
      const updateCourseDto: UpdateCourseDto = {
        name: 'Updated Course',
        tags: ['updated-tag1', 'updated-tag2'],
      };
      const expectedTags = [new Tag(), new Tag()];
      const existingCourse = new Course();
      jest.spyOn(courseRepository, 'preload').mockResolvedValue(existingCourse);
      jest.spyOn(tagRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(tagRepository, 'create').mockReturnValue(new Tag());
      jest.spyOn(courseRepository, 'save').mockResolvedValue(new Course());

      const result = await coursesService.update(courseId, updateCourseDto);

      expect(result.id).toBe(existingCourse.id);
      expect(result.name).toBe(updateCourseDto.name);
      expect(result.tags).toEqual(expectedTags);
    });

    it('should throw NotFoundException if course is not found', async () => {
      const courseId = 'id';
      const updateCourseDto: UpdateCourseDto = {
        name: 'Updated Course',
      };
      jest.spyOn(courseRepository, 'preload').mockResolvedValue(undefined);

      await expect(
        coursesService.update(courseId, updateCourseDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a course with the given id', async () => {
      const courseId = 'id';
      const existingCourse = new Course();
      jest.spyOn(coursesService, 'findOne').mockResolvedValue(existingCourse);
      jest.spyOn(courseRepository, 'delete').mockResolvedValue(undefined);

      await coursesService.remove(courseId);

      expect(courseRepository.delete).toHaveBeenCalledWith(courseId);
    });

    it('should throw NotFoundException if course is not found', async () => {
      const courseId = 'id';
      jest
        .spyOn(coursesService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(coursesService.remove(courseId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
