import { DataSource } from 'typeorm';
import { config } from 'dotenv';

const ENV_LIST = ['local', 'dev', 'prod'];
const index = 0;

config({ path: `.env.${ENV_LIST[index]}` });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: true,
  ssl: ENV_LIST[index] === 'local' ? false : { rejectUnauthorized: false },
});
