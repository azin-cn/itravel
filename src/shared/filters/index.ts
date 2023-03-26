import { Provider } from '@nestjs/common';
import { AllExceptionFilter } from './all-exception.filter';
import { HttpExceptionFilter } from './http-exception.filter';
import { DatabaseQueryExceptionFilter } from './database-exception.filter';
import { APP_FILTER } from '@nestjs/core';

export const GLOBAL_FILTERS: Provider[] = [
  AllExceptionFilter, // nestjs 会按照添加的顺序依次调用，所以应该将通用的过滤器放置在前，以防止特殊的全局过滤被覆盖
  HttpExceptionFilter,
  DatabaseQueryExceptionFilter,
].map((filter) => ({
  provide: APP_FILTER,
  useClass: filter,
}));
