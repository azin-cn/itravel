export class ARTICLE_STATUS {
  /**
   * 草稿箱、未发布
   */
  static NOT_ACTIVE = 0;

  /**
   * 已发布
   */
  static ACTIVE = 1;

  static getAll(): number[] {
    return [this.NOT_ACTIVE, this.ACTIVE];
  }
}
