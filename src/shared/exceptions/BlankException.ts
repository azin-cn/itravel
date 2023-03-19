import { HttpException, HttpStatus } from '@nestjs/common';

export class BlankException extends HttpException {
  constructor(private errCode, private errMsg = 'not found') {
    super({ errCode, errMsg }, HttpStatus.OK);
  }
}
