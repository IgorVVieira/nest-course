import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  // cascade: pode cadastrar tags ao mesmo tempo que cadastramos um curso
  // eager: quando buscarmos um curso, ele já traz as tags automaticamente
  @JoinTable()
  @ManyToMany(() => Tag, (tag) => tag.courses, {
    cascade: true,
    eager: true,
  })
  tags: Tag[];
}
