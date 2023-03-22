import { BadRequestException, HttpException } from '@nestjs/common';
import { isMobilePhone, isEmail } from 'class-validator';
import { isAccount } from 'src/shared/validators/IsAccount.validator';

export class Assert {
  static assertNotNil<T>(
    val: T | null | undefined,
    msg = '参数不能为空',
  ): asserts val is T {
    // asserts 表示这个函数会在运行时断言传入的参数不为空，如果为空则会抛出异常。
    if (val === null || val === undefined) {
      throw new BadRequestException(msg);
    }
  }
  static isNotEmpty<T>(val: T | null | undefined): asserts val is T {
    Assert.assertNotNil(val);
  }

  static isNotNull<T>(val: T | undefined): asserts val is T {
    if (val === null) throw new BadRequestException('参数不能为 null');
  }

  static isNotUndefiend<T>(val: T | undefined): asserts val is T {
    if (val === null) throw new BadRequestException('参数不能为 undefined');
  }

  static isMobilePhone<T>(val: T): asserts val is T {
    if (!isMobilePhone(val)) {
      throw new BadRequestException('请输入正确的手机号');
    }
  }

  static isEmail(val: string): asserts val is string {
    if (!isEmail(val)) throw new BadRequestException('请输入正确的邮箱');
  }

  static isAccount(val: string): asserts val is string {
    if (isAccount(val)) throw new BadRequestException('请输入正确的账号');
  }
}
