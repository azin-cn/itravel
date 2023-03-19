import { HttpException } from '@nestjs/common';

export class BizException extends HttpException {
  constructor(private msg = '系统业务异常', private code = 500) {
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
