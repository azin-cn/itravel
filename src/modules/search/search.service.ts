import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  IPaginationOptions,
  Pagination,
  paginate,
  paginateRaw,
} from 'nestjs-typeorm-paginate';
import { Article } from 'src/entities/article.entity';
import { Spot } from 'src/entities/spot.entity';
import { User } from 'src/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { SpotBriefVO } from '../spot/vo/spot.vo';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Spot)
    private spotRepository: Repository<Spot>,
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
      .orderBy('user.updatedTime');

    const users = await paginate<User>(userHandler, options);
    return users;
  }

  async searchSpot(
    keywords: string,
    options?: IPaginationOptions,
  ): Promise<Pagination<SpotBriefVO>> {
    keywords = `%${keywords}%`;
    const qb = this.spotRepository.createQueryBuilder('spot');
    qb.leftJoin('spot.articles', 'article')
      .leftJoin('spot.province', 'province', 'province.id = spot.province_id')
      .orWhere('LOWER(spot.name) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(spot.description) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(article.title) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(article.summary) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(article.content) LIKE LOWER(:keywords)', { keywords })
      .orderBy('spot.updatedTime');
    qb.select('spot.id, spot.name, spot.description, spot.thumb_url thumbUrl')
      .addSelect('province.name', 'region')
      .addSelect('province.id', 'regionId')
      .addSelect(`'province' as level`);

    const raw = await paginateRaw(qb, options);
    const spotBreifs = new Pagination(
      plainToInstance(SpotBriefVO, raw.items),
      raw.meta,
    );
    return spotBreifs;
  }
}
