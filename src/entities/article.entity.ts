import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  title: string;

  @Column()
  author: string; // uuid 为 key

  @Column({ default: '' })
  thumb_url: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  created_time: number;

  @UpdateDateColumn()
  updated_time: number;
}
