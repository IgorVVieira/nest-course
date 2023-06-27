import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = () =>
  ({
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    preload: jest.fn(),
  } as MockRepository);

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepository: MockRepository;
  let tagRepository: MockRepository;

  // Será executado antes de cada teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: 'COURSE_REPOSITORY',
          useValue: mockRepository(),
        },
        {
          provide: 'TAG_REPOSITORY',
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get<MockRepository>('COURSE_REPOSITORY');
    tagRepository = module.get<MockRepository>('TAG_REPOSITORY');
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const expectCourses = [{}];
      courseRepository.find.mockReturnValue(expectCourses);

      const courses = await service.findAll();
      expect(courses).toEqual(expectCourses);
    });
  });

  describe('findOne', () => {
    it('should return a course', async () => {
      const courseId = '1';
      const expectCourse = {};

      courseRepository.findOneBy.mockReturnValue(expectCourse);

      const course = await service.findOne(courseId);
      expect(course).toEqual(expectCourse);
    });
    it('should throw NotfoundException if course does not exist', async () => {
      const courseId = '1';
      courseRepository.findOneBy.mockReturnValue(undefined);

      try {
        await service.findOne(courseId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(`Course #${courseId} not found`);
      }
    });
  });

  describe('create', () => {
    it('should create a course', async () => {
      const createCourseDto = {
        name: 'Course 1',
        description: 'Course 1 description',
        tags: ['tag1', 'tag2'],
      };
      const expectCourse = {
        id: '1',
        ...createCourseDto,
      };
      tagRepository.findOneBy.mockReturnValue({});
      courseRepository.save.mockReturnValue(expectCourse);
      courseRepository.create.mockReturnValue(expectCourse);

      const course = await service.create(createCourseDto);
      expect(course).toEqual(expectCourse);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const courseId = '1';
      const updateCourseDto = {
        name: 'Course 1',
        description: 'Course 1 description',
        tags: ['tag1', 'tag2'],
      };
      const expectCourse = {
        id: courseId,
        ...updateCourseDto,
      };
      courseRepository.preload.mockReturnValue(expectCourse);
      courseRepository.save.mockReturnValue(expectCourse);

      const course = await service.update(courseId, updateCourseDto);
      expect(course).toEqual(expectCourse);
      expect(courseRepository.preload).toHaveBeenCalledTimes(1);
    });
    it('should throw NotfoundException if course does not exist', async () => {
      const courseId = '1';
      const updateCourseDto = {
        name: 'Course 1',
        description: 'Course 1 description',
        tags: ['tag1', 'tag2'],
      };
      courseRepository.preload.mockReturnValue(undefined);

      try {
        await service.update(courseId, updateCourseDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(`Course #${courseId} not found`);
      }
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      const courseId = '1';

      courseRepository.delete.mockReturnValue({});
      await service.remove(courseId);
      expect(courseRepository.delete).toHaveBeenCalledTimes(1);
    });
    it('should throw NotfoundException if course does not exist', async () => {
      const courseId = '1';
      courseRepository.findOneBy.mockReturnValue(undefined);

      try {
        await service.remove(courseId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(`Course #${courseId} not found`);
      }
    });
  });
});
