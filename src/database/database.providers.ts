import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'postgres',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'curso_nestjs',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      });

      return dataSource.initialize();
    },
  },
];
