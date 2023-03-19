import { HttpException, HttpStatus } from '@nestjs/common';
import { BizException } from './BizException';

export type IException = Record<
  string,
  {
    errCode: number;
    errMsg: string;
  }
>;