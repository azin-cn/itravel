import { HttpException, HttpStatus } from '@nestjs/common';

export enum ExceptionStatus {
  NOT_FOUND = 40040,
}

export class BlankException extends HttpException {
  constructor(
    private errmsg = '未找到对应资源',
    private errcode = ExceptionStatus.NOT_FOUND,
  ) {
    super({ errcode, errmsg }, HttpStatus.OK);
  }
}
