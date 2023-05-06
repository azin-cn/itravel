import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';
import { Spot } from 'src/entities/spot.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { ARTICLE_STATUS } from 'src/shared/constants/article.constant';
import { WorkspaceCounterVO, WorkspaceVO } from './vo/admin.vo';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Spot)
    private spotRepository: Repository<Spot>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async findWorkspaceCounter(): Promise<WorkspaceCounterVO> {
    const today = dayjs().startOf('day').format('YYYY-MM-DD');
    const yesterday = dayjs()
      .subtract(1, 'day')
      .startOf('day')
      .format('YYYY-MM-DD');
    const counter = new WorkspaceCounterVO();

    const [
      spotCount,
      articleCount,
      todayArticleCount,
      yesterdayArticleCount,
      commentCount,
      todayCommentCount,
      yesterdayCommentCount,
    ] = await Promise.all([
      this.spotRepository.count({
        where: {
          isDeleted: false,
        },
      }),
      this.articleRepository.count({
        where: {
          isDeleted: false,
          status: ARTICLE_STATUS.PUBLISH,
        },
      }),
      this.articleRepository.count({
        where: {
          isDeleted: false,
          status: ARTICLE_STATUS.PUBLISH,
          createdTime: MoreThanOrEqual(today),
        },
      }),
      this.articleRepository.count({
        where: {
          isDeleted: false,
          status: ARTICLE_STATUS.PUBLISH,
          createdTime: MoreThanOrEqual(yesterday),
        },
      }),
      this.commentRepository.count({
        where: {
          isDeleted: false,
        },
      }),
      this.commentRepository.count({
        where: {
          isDeleted: false,
          createdTime: MoreThanOrEqual(today),
        },
      }),
      this.commentRepository.count({
        where: {
          isDeleted: false,
          createdTime: MoreThanOrEqual(yesterday),
        },
      }),
    ]);

    counter.spotCount = spotCount;
    counter.articleCount = articleCount;
    counter.todayArticleCount = todayArticleCount;
    counter.yesterdayArticleCount = yesterdayArticleCount;
    counter.commentCount = commentCount;
    counter.todayCommentCount = todayCommentCount;
    counter.yesterdayCommentCount = yesterdayCommentCount;
    return counter;
  }

  async findTimeRangeData() {
    const startDate = dayjs().subtract(8, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const aQB = this.articleRepository.createQueryBuilder('article');
    const sQB = this.spotRepository.createQueryBuilder('spot');
    const cQB = this.commentRepository.createQueryBuilder('comment');

    aQB
      .select(`DATE_TRUNC('day', "article.createdTime")`, 'date')
      .addSelect('COUNT(article.id)', 'count')
      .from(Comment, 'comment')
      .where(`"created_time" >= :startDate AND "created_time" <= :endDate`, {
        startDate,
        endDate,
      })
      .groupBy(`DATE_TRUNC('day', "created_time")`);
  }

  /**
   * 找出首页相关的数据
   * @returns
   */
  async findWorkspaceData(): Promise<WorkspaceVO> {
    const data = new WorkspaceVO();
    data.counter = await this.findWorkspaceCounter();
    return data;
  }
}
