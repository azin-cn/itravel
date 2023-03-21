import { Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

export const GLOBAL_INTERCEPTORS: Provider[] = [].map((item) => ({
  provide: APP_INTERCEPTOR,
  useClass: item,
}));
