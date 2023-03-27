import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('title')
export class Title {
  /**
   * 头衔 id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 头像名称
   */
  @Column()
  name: string;

  @OneToOne(() => User, (user) => user.title)
  user: User;

  /**
   * 是否删除
   */
  @Column({ default: false })
  isDeleted: boolean;

  /**
   * 创建时间
   */
  @CreateDateColumn({type: 'timestamp'})
  createdTime: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn({type: 'timestamp'})
  updatedTime: Date;
}
