import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity()
export class Tag {
  /**
   * 主键，tag id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * tag 名称
   */
  @Column()
  name: string;

  /**
   * 由谁创建
   * 将User的主键作为Tag的user字段的值，即user字段是外键
   */
  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn()
  user: User;

  /**
   * tag 文章
   */
  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];

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

  /**
   * 是否删除
   */
  @Column({ default: false })
  isDeleted: boolean;
}
