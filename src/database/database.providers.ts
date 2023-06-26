import { DataSource } from 'typeorm';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: parseInt(process.env.POSTGRES_PORT) as number,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});

const testDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: parseInt(process.env.POSTGRES_PORT) as number,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB_TEST,
  autoLoadEntities: true,
  synchronize: true,
});

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];

export const databaseTestProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return testDataSource.initialize();
    },
  },
];
