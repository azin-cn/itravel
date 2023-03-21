import { Provider } from '@nestjs/common';
import { TransformUserAuthPipe, TransformUserPipe } from './user.pipe';
import { APP_PIPE } from '@nestjs/core';

export const GLOBAL_PIPES: Provider[] = [
  // TransformUserPipe,
  // TransformUserRegisterPipe,
].map((pipe) => ({
  provide: APP_PIPE,
  useClass: pipe,
}));
