import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async search(keywords: string, options?: IPaginationOptions) {
    keywords = `%${keywords}%`;

    const userHandler = this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(user.description) LIKE LOWER(:keywords)', { keywords });
    // .orWhere('LOWER(user.email) LIKE LOWER(:keywords)', { keywords })

    const articleHandler = this.articleRepository
      .createQueryBuilder('article')

      /**
       * 评论必然存在于文章中
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
      .groupBy('article.id');

    /**
     * 另外一种使用方式
     * const articles = paginate<Article>({item, total, page, limit})
     */
    const users = await paginate<User>(userHandler, { page: 1, limit: 10 });
    const articles = await paginate<Article>(articleHandler, {
      page: 1,
      limit: 10,
    });

    try {
      console.log('=============================');
      console.log(await articleHandler.getOneOrFail());
    } catch (error) {
      console.error(error);
    }
    console.log(await articleHandler.getRawOne());

    return {
      users,
      articles,
    };
  }
}
