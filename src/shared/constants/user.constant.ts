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
   * 管理员
   */
  static ADMIN = 1;

  /**
   * 超级管理员
   */
  static ROOT = 2;

  static getAll(): number[] {
    return [this.VISITOR, this.ADMIN, this.ROOT];
  }
}

export const USER_KEY = 'userId';
