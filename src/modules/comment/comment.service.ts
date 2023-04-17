import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';
import { Assert } from 'src/utils/Assert';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  /**
   * 通过ID查找评论/回复
   * @param id
   * @returns
   */
  async findCommentById(id: string): Promise<Comment> {
    return this.commentRepository.findOneBy({
      id,
      isDeleted: false,
    });
  }

  /**
   * 创建评论
   * @param comment
   * @returns
   */
  async create(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  /**
   * TODO: 通过commentId查找文章
   * 当用户点击消息列表时，跳转文章
   * @param id
   * @returns
   */
  async findArticleByCommentId(id: string) {
    //
  }

  /**
   * 通过文章id查找评论
   */
  async findFormatCommentsByArticleId(
    id: string,
    options?: IPaginationOptions,
  ): Promise<Pagination<Comment>> {
    /**
     * 查询评论/回复的信息
     * 第一级 parent 为 null 的根评论
     * 第二级 parent 不为 null 的子回复
     */
    const qb = this.commentRepository.createQueryBuilder('comment');
    qb.where('comment.article_id = :id', { id })
      .andWhere('comment.parent_id IS NULL AND comment.isDeleted = false')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('comment.children', 'children')
      .leftJoinAndSelect('children.parent', 'childParent')
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.toUser', 'toUser')
      .leftJoin('children.user', 'childUser')
      .leftJoin('children.toUser', 'childToUser');

    qb.addSelect([
      'user.id',
      'user.username',
      'user.description',
      'user.thumbUrl',
      'user.avatar',
      'user.visitors',

      'toUser.id',
      'toUser.username',
      'toUser.description',
      'toUser.thumbUrl',
      'toUser.avatar',
      'toUser.visitors',

      'childUser.id',
      'childUser.username',
      'childUser.description',
      'childUser.thumbUrl',
      'childUser.avatar',
      'childUser.visitors',

      'childToUser.id',
      'childToUser.username',
      'childToUser.description',
      'childToUser.thumbUrl',
      'childToUser.avatar',
      'childToUser.visitors',
    ]);

    return paginate(qb, options);
  }

  /**
   * 软删除评论
   * @param id
   * @returns
   */
  async delete(id: string): Promise<UpdateResult> {
    const comment = await this.findCommentById(id);
    Assert.isNotEmpty(comment);
    return this.commentRepository.update(id, { isDeleted: true });
  }

  /**
   * 硬删除评论，管理员模式
   * @param id
   * @returns
   */
  async deleteAdmin(id: string): Promise<DeleteResult> {
    return this.commentRepository.delete(id);
  }
}
