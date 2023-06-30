import { DataSource, DataSourceOptions } from 'typeorm';
import AppConfig from './app.config';

const config = AppConfig();

export const connectionSource = new DataSource(
  config.database as DataSourceOptions,
);
