import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Tag } from './tag.entity';
import { ARTICLE_STATUS } from 'src/shared/constants/article.constant';
import { Exclude } from 'class-transformer';
import { Category } from './category.entity';

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
   */
  @ManyToOne((type) => User, (user) => user.articles) // 注入User，user.articles 关联的属性
  author: User;

  /**
   * 文章缩略图
   */
  @Column()
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
   */
  @ManyToOne(() => Category, (category) => category.articles)
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
   */
  @Column('simple-enum', { enum: ARTICLE_STATUS.getAll() })
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
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdTime: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedTime: Date;
}
