import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = () =>
  ({
    findOneBy: jest.fn(),
    findAll: jest.fn(),
  } as MockRepository);

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepository: MockRepository;

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
});
