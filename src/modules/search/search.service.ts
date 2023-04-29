import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  IPaginationOptions,
  Pagination,
  paginate,
  paginateRaw,
  paginateRawAndEntities,
} from 'nestjs-typeorm-paginate';
import { Article } from 'src/entities/article.entity';
import { Spot } from 'src/entities/spot.entity';
import { User } from 'src/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { SpotBriefVO } from '../spot/vo/spot.vo';
import { USER_STATUS } from 'src/shared/constants/user.constant';
import { ARTICLE_STATUS } from 'src/shared/constants/article.constant';

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

    const qb = this.articleRepository
      .createQueryBuilder('article')
      /**
       * 作者信息
       */
      .leftJoin('article.author', 'author')
      /**
       * 分类信息
       */
      .leftJoin('article.category', 'category')
      /**
       * tags信息
       */
      .leftJoin('article.tags', 'tags')
      /**
       * 评论数量信息
       */
      .leftJoin('article.comments', 'comment')
      /**
       * 景点信息
       */
      .leftJoin('article.spot', 'spot');

    qb.select([
      'article.id',
      'article.title',
      'article.thumbUrl',
      'article.summary',
      // 'article.content',
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
      'author.title',
      'author.description',
      'author.thumbUrl',
      'category.id',
      'category.name',
      'tags.id',
      'tags.name',
      'spot.id',
      'spot.name',
      'spot.thumbUrl',
      'spot.description',
    ])
      .addSelect('COALESCE(COUNT(comment.id), 0)', 'commentCount')
      .where(
        `(
          LOWER(article.title) LIKE LOWER(:keywords) 
          OR 
          LOWER(article.summary) LIKE LOWER(:keywords)
          OR
          LOWER(article.content) LIKE LOWER(:keywords)
          OR
          LOWER(comment.content) LIKE LOWER(:keywords)
         )
         `,
        { keywords },
      )
      .andWhere('article.isDeleted = false')
      .andWhere('article.status = :status', { status: ARTICLE_STATUS.PUBLISH })
      .orderBy('article.updatedTime')
      .groupBy('article.id')
      .addGroupBy('tags.id');

    const [res, raw]: [Pagination<Article>, any] = await paginateRawAndEntities(
      qb,
      options,
    );

    /**
     * 将数据映射为整数
     */
    res.items.forEach(
      (item, index) => (item.commentCount = parseInt(raw[index].commentCount)),
    );

    return res;
  }

  async searchUser(
    keywords: string,
    options?: IPaginationOptions,
  ): Promise<Pagination<User>> {
    keywords = `%${keywords}%`;
    const userHandler = this.userRepository
      .createQueryBuilder('user')
      .where(
        `
        (
          LOWER(user.username) LIKE LOWER(:keywords)
          OR
          LOWER(user.description) LIKE LOWER(:keywords)
        )
        `,
        { keywords },
      )
      .andWhere('user.status = :status', { status: USER_STATUS.ACTIVE })
      .andWhere('user.isDeleted = false')
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
      .where('LOWER(spot.name) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(spot.description) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(article.title) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(article.summary) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(article.content) LIKE LOWER(:keywords)', { keywords })
      .orWhere('LOWER(province.name) LIKE LOWER(:keywords)', { keywords })
      .orderBy('spot.updatedTime');
    qb.select('spot.id, spot.name, spot.description, spot.thumb_url thumbUrl')
      .addSelect('province.name', 'region')
      .addSelect('province.id', 'regionId')
      .addSelect(`'province' as level`)
      .groupBy('spot.id');

    const raw = await paginateRaw(qb, options);
    const spotBreifs = new Pagination(
      plainToInstance(SpotBriefVO, raw.items),
      raw.meta,
    );
    console.log(spotBreifs.items.length, raw.items.length, raw.meta.totalPages);
    return spotBreifs;
  }
}
