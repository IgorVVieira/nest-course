import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [CoursesService],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const expectedResult = [new Course(), new Course()];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a course with the given id', async () => {
      const courseId = '1';
      const expectedCourse = new Course();
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedCourse);

      const result = await controller.findOne(courseId);

      expect(result).toEqual(expectedCourse);
    });
  });

  describe('create', () => {
    it('should create a new course with the provided data', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Test Course',
        description: 'Test Course Description',
        tags: ['tag1', 'tag2'],
      };
      const expectedCourse = new Course();
      jest.spyOn(service, 'create').mockResolvedValue(expectedCourse);

      const result = await controller.create(createCourseDto);

      expect(result).toEqual(expectedCourse);
    });
  });

  describe('update', () => {
    it('should update a course with the provided data', async () => {
      const courseId = '1';
      const updateCourseDto: UpdateCourseDto = {
        name: 'Updated Course',
        tags: ['updated-tag1', 'updated-tag2'],
      };
      const expectedCourse = new Course();
      jest.spyOn(service, 'update').mockResolvedValue(expectedCourse);

      const result = await controller.update(courseId, updateCourseDto);

      expect(result).toEqual(expectedCourse);
    });
  });

  describe('remove', () => {
    it('should remove a course with the given id', async () => {
      const courseId = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(courseId);

      expect(result).toBeUndefined();
    });
  });
});
