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

  @Column()
  last_time: number;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  created_time: number;

  @UpdateDateColumn()
  updated_time: number;

  // 一对多
  @OneToMany(() => Article, (article: Article) => article.author)
  articles: Article[];
}
