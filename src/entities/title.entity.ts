import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity('title')
export class Title {
  /**
   * 头衔 id
   */
  @PrimaryGeneratedColumn('uuid', { comment: '头衔 id' })
  id: string;

  /**
   * 头像名称
   */
  @Column({ comment: '头像名称' })
  name: string;

  @OneToOne(() => User, (user) => user.title)
  user: User;

  /**
   * 是否删除
   */
  @Exclude()
  @Column({ default: false, comment: '是否删除' })
  isDeleted: boolean;

  /**
   * 创建时间
   * YYYY-MM-DD HH:mm:ss
   */
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdTime: string;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedTime: string;
}
