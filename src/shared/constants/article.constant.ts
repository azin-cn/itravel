export class ARTICLE_STATUS {
  /**
   * 草稿箱、未发布
   */
  static DRAFT = 0;

  /**
   * 已发布
   */
  static PUBLISH = 1;

  static getAll(): number[] {
    return [this.DRAFT, this.PUBLISH];
  }
}
