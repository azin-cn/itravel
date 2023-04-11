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
import { User } from './user.entity';
import { Article } from './article.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Category {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 名称
   */
  @Column('tinytext')
  name: string;

  /**
   * 创建用户
   * 将User的主键作为Category的user字段的值即user字段是外键
   */
  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn()
  user: User;

  /**
   * 一对多，一篇文章只属于一个分类
   */
  @OneToMany(() => Article, (article) => article.category, {
    cascade: ['insert', 'update'],
  })
  articles: Article[];

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
  createdTime: string;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedTime: string;
}
