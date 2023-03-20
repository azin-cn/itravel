import { HttpException } from '@nestjs/common';
import { ResultCode } from '../vo/ResultHelp';

export class BizException extends HttpException {
  constructor(private msg = '系统业务异常', private code = ResultCode.FAIL) {
    super(msg, code);
  }

  setCode(_code: number) {
    this.code = _code;
  }

  getCode(): number {
    return this.code;
  }

  setMsg(_msg: string) {
    this.msg = _msg;
  }

  getMsg(): string {
    return this.msg;
  }
}
