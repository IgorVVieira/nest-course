import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

// PartialType -> diz q se apenas um campo for enviado, ele será atualizado
export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
