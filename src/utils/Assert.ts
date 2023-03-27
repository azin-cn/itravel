import { BadRequestException, HttpException } from '@nestjs/common';
import { isMobilePhone, isEmail } from 'class-validator';
import { User } from 'src/entities/user.entity';
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

  static isNotNull<T>(
    val: T | undefined,
    msg = '参数不能为 null',
  ): asserts val is T {
    if (val === null) throw new BadRequestException(msg);
  }

  static isNotUndefiend<T>(
    val: T | undefined,
    msg = '参数不能为 undefined',
  ): asserts val is T {
    if (val === null) throw new BadRequestException(msg);
  }

  static isNotZero(val: number, msg = '参数不能为0'): asserts val is number {
    if (val === 0) throw new BadRequestException(msg);
  }

  static isMobilePhone<T>(
    val: T,
    msg = '请输入正确的手机号',
  ): asserts val is T {
    if (!isMobilePhone(val)) {
      throw new BadRequestException(msg);
    }
  }

  static isEmail(val: string, msg = '请输入正确的邮箱'): asserts val is string {
    if (!isEmail(val)) throw new BadRequestException(msg);
  }

  static isAccount(
    val: string,
    msg = '请输入正确的账号',
  ): asserts val is string {
    if (isAccount(val)) throw new BadRequestException(msg);
  }

  static isNotEmtpyUser(
    user: User,
    msg = '用户不存在或已删除',
  ): asserts user is User {
    if (!user) throw new BadRequestException(msg);
  }
}
