import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const AppConfig = () => {
  return {
    database: {
      type: 'postgres' as const,
      host: `${process.env.DB_HOST}` || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: `${process.env.DB_USERNAME}` || 'basic-nestjs',
      password: `${process.env.DB_PASSWORD}` || 'basic-nestjs',
      database: `${process.env.DB_NAME}` || 'basic-nestjs',
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/database/migrations/*{.ts,.js}'],
      seeds: ['dist/database/seeders/*{.ts,.js}'],
      factories: ['dist/**/*.factory{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      ttl: parseInt(process.env.JWT_TTL) || 600,
      refreshTtl: parseInt(process.env.JWT_REFRESH_TTL) || 2592000,
    },
  };
};

export default AppConfig;
