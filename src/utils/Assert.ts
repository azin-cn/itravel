import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { isMobilePhone, isEmail } from 'class-validator';
import { Article } from 'src/entities/article.entity';
import { Spot } from 'src/entities/spot.entity';
import { User } from 'src/entities/user.entity';
import { isAccount } from 'src/shared/validators/IsAccount.validator';

export class Assert {
  /**
   * 非空断言
   * @param val
   * @param msg
   */
  static assertNotNil<T>(
    val: T | null | undefined,
    msg = '参数不能为空',
  ): asserts val is T {
    // asserts 表示这个函数会在运行时断言传入的参数不为空，如果为空则会抛出异常。
    if (val === null || val === undefined) {
      throw new BadRequestException(msg);
    }
  }

  /**
   * 非空断言
   * @param val
   */
  static isNotEmpty<T>(val: T | null | undefined): asserts val is T {
    Assert.assertNotNil(val);
  }

  /**
   * 非null断言
   * @param val
   * @param msg
   */
  static isNotNull<T>(
    val: T | undefined,
    msg = '参数不能为 null',
  ): asserts val is T {
    if (val === null) throw new BadRequestException(msg);
  }

  /**
   * 非undefined断言
   * @param val
   * @param msg
   */
  static isNotUndefiend<T>(
    val: T | undefined,
    msg = '参数不能为 undefined',
  ): asserts val is T {
    if (val === null) throw new BadRequestException(msg);
  }

  /**
   * 非0断言
   * @param val
   * @param msg
   */
  static isNotZero(val: number, msg = '参数不能为0'): asserts val is number {
    if (val === 0) throw new BadRequestException(msg);
  }

  /**
   * 手机号断言
   * @param val
   * @param msg
   */
  static isMobilePhone<T>(
    val: T,
    msg = '请输入正确的手机号',
  ): asserts val is T {
    if (!isMobilePhone(val)) {
      throw new BadRequestException(msg);
    }
  }

  /**
   * 邮箱断言
   * @param val
   * @param msg
   */
  static isEmail(val: string, msg = '请输入正确的邮箱'): asserts val is string {
    if (!isEmail(val)) throw new BadRequestException(msg);
  }

  /**
   * 自定义账号断言
   * @param val
   * @param msg
   */
  static isAccount(
    val: string,
    msg = '请输入正确的账号',
  ): asserts val is string {
    if (isAccount(val)) throw new BadRequestException(msg);
  }

  /**
   * 相等断言
   * @param v1
   * @param v2
   * @param msg
   */
  static isEqual<T>(v1: T, v2: T, msg = '参数不相同'): asserts v1 is T {
    if (v1 !== v2) throw new BadRequestException(msg);
  }

  /**
   * 非空User断言
   * @param user
   * @param msg
   */
  static isNotEmptyUser(
    user: User,
    msg = '用户不存在或已注销',
  ): asserts user is User {
    if (!user) throw new NotFoundException(msg);
  }

  /**
   * 非空Article断言
   * @param article
   * @param msg
   */
  static isNotEmptyArticle(
    article: Article,
    msg = '文章不存在或已删除',
  ): asserts article is Article {
    if (!article) throw new NotFoundException(msg);
  }

  /**
   *
   */
  static isNotEmptySpot(
    val: Spot,
    msg = '景点不存在或已删除',
  ): asserts val is Spot {
    if (!val) throw new NotFoundException(msg);
  }
}
