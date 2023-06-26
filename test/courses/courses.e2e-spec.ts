import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CoursesModule } from '../../src/courses/courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';

describe('CoursesController (e2e) /courses', () => {
  let app: INestApplication;

  // faz uma única vez antes de todos os testes
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoursesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'postgres',
          port: parseInt(process.env.POSTGRES_PORT) as number,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB_TEST,
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // faz uma única vez depois de todos os testes
  afterAll(async () => {
    await app.close();
  });

  it('/courses (GET)', () => {
    return request(app.getHttpServer()).get('/courses').expect(200);
  });

  it('/courses (POST)', () => {
    return request(app.getHttpServer()).post('/courses').expect(201);
  });
});
