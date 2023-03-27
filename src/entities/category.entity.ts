import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity()
export class Category {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 创建用户
   */
  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  /**
   * 一对多，一篇文章只属于一个分类
   */
  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];

  /**
   * 是否删除
   */
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
