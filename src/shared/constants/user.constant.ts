export class USER_STATUS {
  /**
   * 已激活
   */
  static ACTIVE = 1;

  /**
   * 未激活
   */
  static NO_ACTIVE = 0;
}

export class USER_ROLES {
  /**
   * 浏览者
   */
  static VISITOR = 0;

  /**
   * 作者
   */
  static AUTHOR = 1;

  /**
   * 管理员
   */
  static ADMIN = 2;

  /**
   * 超级管理员
   */
  static ROOT = 3;

  static getAll(): number[] {
    return [this.VISITOR, this.AUTHOR, this.ADMIN, this.ROOT];
  }
}
