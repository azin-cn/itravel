import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';
import { Tag } from 'src/entities/tag.entity';
import { Assert } from 'src/utils/Assert';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  /**
   * 通过id查找文章
   * @param id
   * @returns
   */
  async findArticleById(id: string) {
    const qb = this.articleRepository
      .createQueryBuilder('article')
      .where('article.id = :id', { id })
      /**
       * 查询作者的详细信息
       */
      .leftJoinAndSelect('article.author', 'author')
      /**
       * 查询分类的详细信息
       */
      .leftJoinAndSelect('article.category', 'category')
      /**
       * 查询tags的详细信息
       */
      .leftJoinAndSelect('article.tags', 'tags');

    const article = await qb.getOne();

    Assert.isNotEmptyArticle(article);

    return article;
  }

  /**
   * 通过id查找文章，管理员模式
   * @param id
   * @returns
   */
  async findArticleByIdAdmin(id: string): Promise<Article> {
    const article = await this.articleRepository.findOneBy({ id });
    Assert.isNotEmptyArticle(article);
    return article;
  }

  /**
   * 通过用户id查找文章
   * @param uid
   * @returns
   */
  async findArticleByUser(uid: string): Promise<Article[]> {
    const articles = await this.articleRepository.find({
      where: { author: { id: uid }, isDeleted: false },
    });
    return articles;
  }

  /**
   * 创建文章
   * @param article
   * @returns
   */
  async create(article: Article): Promise<Article> {
    /**
     * 文章的创建并没有过多的限制
     */
    return this.articleRepository.save(article);
  }

  async update(id: string, article: Article): Promise<Article> {
    /**
     * 文章的更新无过多的限制
     */
    const articleRep = await this.findArticleById(id);

    Assert.assertNotNil(articleRep, '文章不存在或已删除');

    const { affected } = await this.articleRepository.update(id, article);

    /**
     * 更新后非0断言检查
     */
    Assert.isNotZero(affected, '文章更新失败');

    return this.findArticleById(id);
  }

  /**
   * 删除文章
   * @param id
   * @returns
   */
  async delete(id: string): Promise<DeleteResult> {
    // return this.articleRepository.delete(id);
    const article = await this.findArticleById(id);
    Assert.isNotEmptyArticle(article);
    return this.articleRepository.update(id, { isDeleted: true });
  }

  /**
   * 硬删除用户，管理员模式
   * @param id
   * @returns
   */
  async deleteAdmin(id: string): Promise<DeleteResult> {
    return this.articleRepository.delete(id);
  }
}
