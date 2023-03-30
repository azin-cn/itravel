import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';
import { Assert } from 'src/utils/Assert';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}


  /**
   * 创建评论
   * @param comment 
   * @returns 
   */
  async create(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  /**
   * 通过commentId查找文章
   * 当用户点击消息列表时，跳转文章
   * @param id
   * @returns
   */
  async findArticleByCommentId(id: string) {
    const qb = this.articleRepository
      .createQueryBuilder('article')
      // .addSelect('article.*')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.id = :id', { id });

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
}
