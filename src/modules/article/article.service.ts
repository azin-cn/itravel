import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginateRawAndEntities } from 'nestjs-typeorm-paginate';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';
import { Tag } from 'src/entities/tag.entity';
import { ARTICLE_STATUS } from 'src/shared/constants/article.constant';
import { PaginationOptions } from 'src/shared/dto/pagination.dto';
import { Assert } from 'src/utils/Assert';
import { DeleteResult, Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private userService: UserService,
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
    article.author = this.userService.masksUser(article.author);

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

  /**
   * 获取指定旅游景点相关的文章
   */
  async findArticlesBySpotId(
    id: string,
    options?: PaginationOptions,
  ): Promise<Pagination<Article>> {
    const qb = this.articleRepository
      .createQueryBuilder('article')
      .where('1=1 AND article.status= :status', {
        status: ARTICLE_STATUS.PUBLISH,
      })
      .leftJoin('article.spot', 'spot')
      .leftJoin('article.author', 'author')
      .leftJoin('article.comments', 'comment')
      /**
       * 子查询获取评论数量，附加到Article实体中的commentCount
       * 重点：映射数据时，应该将此别名设置为蛇形，并结合typeorm中默认的表名
       */
      .select([
        'article.id',
        'article.title',
        'article.thumbUrl',
        'article.summary',
        'article.content',
        'article.status',
        'article.publishTime',
        'article.createdTime',
        'article.updatedTime',
        'article.likeCount',
        'article.favCount',
        'article.viewCount',
        'author.id',
        'author.username',
        'author.avatar',
        'author.description',
        'author.title',
        'spot.id',
        'spot.name',
        'spot.description',
      ])
      .addSelect('COALESCE(COUNT(comment.id), 0)', 'commentCount')
      .andWhere('spot.id = :id', { id })
      .groupBy('article.id')
      .orderBy('article.updatedTime', 'DESC');

    const [res, raw]: [Pagination<Article>, any] = await paginateRawAndEntities(
      qb,
      options,
    );

    res.items.forEach(
      (item, index) => (item.commentCount = parseInt(raw[index].commentCount)),
    );

    return res;
  }

  async findRandArticles(limit = 10): Promise<Article[]> {
    const qb = this.articleRepository.createQueryBuilder('article');

    qb.leftJoin('article.author', 'author')
      .leftJoin('article.comments', 'comment')
      .orderBy('RAND()')
      .limit(limit)
      .select([
        'article.id',
        'article.title',
        'article.thumbUrl',
        'article.summary',
        'article.content',
        'article.status',
        'article.publishTime',
        'article.createdTime',
        'article.updatedTime',
        'article.likeCount',
        'article.favCount',
        'article.viewCount',
        'author.id',
        'author.username',
        'author.avatar',
        'author.description',
        'author.title',
      ])
      .addSelect('COALESCE(COUNT(comment.id), 0)', 'commentCount')
      .groupBy('article.id');
    const { entities, raw } = await qb.getRawAndEntities();
    entities.forEach((article, index) => {
      article.commentCount = Number(raw[index].commentCount);
    });
    return entities;
  }
}
