import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseRefactioring1685894810432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('ALTER TABLE "courses" RENAME COLUMN "name" to "course"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('ALTER TABLE "courses" RENAME COLUMN "course" to "name"');
  }
}
