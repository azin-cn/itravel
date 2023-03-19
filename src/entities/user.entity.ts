import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Article } from './article.entity';
import { Title } from './title.entity';
import { Tag } from './tag.entity';

@Entity('user')
export class User {
  /**
   * user id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 用户名称
   */
  @Column({ length: 20 })
  username: string;

  /**
   * 用户头像
   */
  @Column()
  avatar: string;

  /**
   * 用户密码
   */
  @Column()
  password: string;

  /**
   * 用户简介
   */
  @Column({ length: 20 })
  description: string;

  /**
   * 用户邮箱
   */
  @Column()
  email: string;

  /**
   * 用户号码
   */
  @Column()
  phone: string;

  /**
   * 是否为园区，0，1，2，方便以后拓展
   */
  @Column()
  scenicArea: number;

  /**
   * 访客数量
   */
  @Column()
  visitors: number;

  /**
   * 用户头衔
   */
  @OneToOne(() => Title, (title) => title.user)
  @JoinColumn()
  title: Title;

  /**
   * 用户创建的文章标签
   */
  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  /**
   * 创建的文章
   */
  @OneToMany(() => Article, (article) => article.author) //一对多，回调返回的类型，注入关联的属性
  articles: Article[];

  /**
   * 上一次登录时间
   */
  @Column()
  lastTime: Date;

  /**
   * 是否删除
   */
  @Column({ default: false })
  isDeleted: boolean;

  /**
   * 创建时间
   */
  @CreateDateColumn()
  createdTime: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn()
  updatedTime: Date;
}
