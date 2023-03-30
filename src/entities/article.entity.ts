import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Tag } from './tag.entity';
import { ARTICLE_STATUS } from 'src/shared/constants/article.constant';
import { Exclude } from 'class-transformer';
import { Category } from './category.entity';
import { Comment } from './comment.entity';

@Entity('article')
export class Article {
  /**
   * 文章ID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 文章title
   */
  @Column()
  title: string;

  /**
   * 文章作者
   * 将user的主键作为article中的外键
   */
  @ManyToOne((type) => User, (user) => user.articles) // 注入User，user.articles 关联的属性
  @JoinColumn()
  author: User;

  /**
   * 文章缩略图
   */
  @Column({ nullable: true })
  thumbUrl: string;

  /**
   * 文章的简要
   */
  @Column({ type: 'text', default: null })
  summary: string;

  /**
   * 文章内容
   */
  @Column('text')
  content: string;

  /**
   * 文章评论
   */
  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  /**
   * 浏览量
   */
  @Column({ default: 0 })
  viewCount: number;

  /**
   * 点赞量
   */
  @Column({ default: 0 })
  likeCount: number;

  /**
   * 收藏量
   */
  @Column({ default: 0 })
  favCount: number;

  /**
   * 文章分类
   * 将category的主键作为article中的外键
   */
  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn()
  category: Category;

  /**
   * 文章标签，@JoinTable标识字段为被所有者方，当前类为所有者一方
   * @JoinTable()是@ManyToMany关系所必需的，无论是单项关系还是双向关系，只存在一边
   * 保存时需要先生成/保存主实体，因为主实体的id需要作为其他实体的索引依赖
   * 然后生成/设置其他实体中主实体的属性，最后保存其他实体
   */
  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable()
  tags: Tag[];

  /**
   * 文章状态
   * ARTICLE.DRAFT 0 未发布、草稿箱
   * ARTICLE.PUBLISH 1 已发布
   */
  @Column('simple-enum', {
    enum: ARTICLE_STATUS.getAll(),
    default: ARTICLE_STATUS.DRAFT,
  })
  status: number;

  /**
   * 发布时间
   */
  @Column({ nullable: true, type: 'timestamp' })
  publishTime: Date;

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
