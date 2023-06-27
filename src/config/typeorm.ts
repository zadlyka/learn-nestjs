import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres' as const,
  host: `${process.env.DB_HOST}` || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: `${process.env.DB_USERNAME}` || 'basic-nestjs',
  password: `${process.env.DB_PASSWORD}` || 'basic-nestjs',
  database: `${process.env.DB_NAME}` || 'basic-nestjs',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  seeds: ['dist/seeders/*{.ts,.js}'],
  factories: ['src/**/factories/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
