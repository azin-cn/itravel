import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Article } from './article.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  username: string;

  @Column()
  password: string;

  @Column({ length: 20 })
  description: string;

  @Column({ default: false })
  isDeleted: boolean;

  @UpdateDateColumn()
  lastTime: Date;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  // 一对多，回调返回的类型，注入关联的属性
  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
