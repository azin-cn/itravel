export const AUTHOR_KEY = 'AUTHOR_KEY';

export class AUTHOR_SCENE {
  /**
   * article更新时
   */
  static ARTICLE = 'article';

  /**
   * title更新时
   */
  static TITLE = 'title';

  /**
   * tag 更新时
   */
  static TAG = 'tag';

  static getAll(): string[] {
    return [this.ARTICLE, this.TITLE, this.TAG];
  }
}
