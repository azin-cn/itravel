export class AUTH_TYPE {
  /**
   * 密码登录，账号可以是手机号、邮箱、用户名
   */
  static ACCOUNT = 1;

  /**
   * 手机验证码
   */
  static MOBILE = 2;

  /**
   * 第三方登录，如Github、微信、QQ
   */
  static THIRD = 3;

  /**
   * 获取所有Type
   * @returns 所有Type
   */
  static getAll(): number[] {
    // return Object.getOwnPropertyNames(AUTH_TYPE)
    //   .filter((prop) => typeof AUTH_TYPE[prop] !== 'function')
    //   .map((prop) => AUTH_TYPE[prop]);
    return [this.MOBILE, this.ACCOUNT, this.THIRD];
  }
}
