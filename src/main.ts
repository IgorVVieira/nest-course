import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Para validar tipos do DTO
  app.useGlobalPipes(
    new ValidationPipe({
      // Impede que campos não especificados no DTO sejam enviados
      whitelist: true,
      // Gera erro caso campos não especificados no DTO sejam enviados
      forbidNonWhitelisted: true,
      // Transforma os tipos dos campos para os especificados no DTO
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();

// npx typeorm migration:run -d dist/database/database.providers.js
// npx typeorm migration:crate ./src/migrations/CreateTagsTable
