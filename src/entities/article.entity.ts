import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  title: string;

  // 注入User，便于使用
  @ManyToOne((type) => User, (user) => user.articles) // user.articles 关联的属性
  author: string; // uuid 为 key

  @Column({ default: '' })
  thumbUrl: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdTIme: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}
