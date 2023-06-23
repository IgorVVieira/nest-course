import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Course } from './course.entity';

import { v4 as uuid } from 'uuid';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToMany(() => Course, (course) => course.tags)
  courses: Course[];

  @BeforeInsert()
  generateId(): void {
    if (this.id) {
      return;
    }
    this.id = uuid();
  }
}
