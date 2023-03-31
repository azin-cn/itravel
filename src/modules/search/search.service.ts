import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Article } from 'src/entities/article.entity';
import { User } from 'src/entities/user.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async searchArticle(
    keywords: string,
    options?: IPaginationOptions,
  ): Promise<Pagination<Article>> {
    keywords = `%${keywords}%`;

    const articleHandler = this.articleRepository
      .createQueryBuilder('article')

      /**
       * 评论必然存在于文章中，可以使用innerJoin
       */
      .leftJoin('article.comments', 'comment')
      /**
       * 子查询获取评论数量，附加到Article实体中的commentCount
       * 重点：映射数据时，应该将此别名设置为蛇形，并结合typeorm中默认的表名
       */
      .addSelect('COALESCE(COUNT(comment.id), 0)', 'article_comment_count')
      .where('LOWER(article.title) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(article.summary) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(article.content) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(comment.content) LIKE LOWER(:keywords)', { keywords })
      .orderBy('article.updatedTime')
      .groupBy('article.id');

    /**
     * 另外一种使用方式
     * const articles = paginate<Article>({item, total, page, limit})
     */
    const articles = await paginate<Article>(articleHandler, options);

    return articles;
  }

  async searchUser(
    keywords: string,
    options?: IPaginationOptions,
  ): Promise<Pagination<User>> {
    keywords = `%${keywords}%`;
    const userHandler = this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(user.description) LIKE LOWER(:keywords)', { keywords })
      .orderBy('article.updatedTime');

    const users = await paginate<User>(userHandler, options);
    return users;
  }
}
