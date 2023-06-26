import { Module } from '@nestjs/common';
import { databaseProviders, databaseTestProviders } from './database.providers';

@Module({
  providers: [...databaseProviders, ...databaseTestProviders],
  exports: [...databaseProviders, ...databaseTestProviders],
})
export class DatabaseModule {}
