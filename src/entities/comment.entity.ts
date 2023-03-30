import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

/**
 * 评论系统分为两种角色
 * 一是作为文章的根评论，成为评论
 * 二是作为评论的回复，称为回复
 */
@Entity()
export class Comment {
  /**
   * 评论id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 评论内容
   */
  @Column('text')
  content: string;

  /**
   * 评论作者
   */
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  user: User;

  /**
   * 被回复的人，对应某人受到的评论
   */
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  toUser: User;

  /**
   * 回复的根评论
   */
  @ManyToOne((type) => Comment, (comment) => comment.children, {
    nullable: true,
  })
  @JoinColumn()
  parent: Comment;

  /**
   * 根评论的回复
   */
  @OneToMany((type) => Comment, (comment) => comment.parent)
  children: Comment[];

  /**
   * 评论所在文章
   */
  @ManyToOne(() => Article, (article) => article.comments)
  @JoinColumn()
  article: Article;

  /**
   * 是否删除
   */
  @Exclude()
  @Column({ default: false })
  isDeleted: boolean;

  /**
   * 创建时间
   * YYYY-MM-DD HH:mm:ss
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdTime: string;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedTime: string;
}
