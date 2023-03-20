import { Provider } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { DatabaseQueryExceptionFilter } from './database-exception.filter';
import { APP_FILTER } from '@nestjs/core';

export const GLOBAL_FILTERS: Provider[] = [
  HttpExceptionFilter,
  DatabaseQueryExceptionFilter,
].map((filter) => ({
  provide: APP_FILTER,
  useClass: filter,
}));
