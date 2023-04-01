import {
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpotMonth } from './spot-month.entity';
import { Region } from './region.entity';

export class Spot {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * name
   */
  @Column({ type: 'string' })
  name: string;

  /**
   * 使用spot-mongth中间表拓展更多信息
   */
  @OneToMany(() => SpotMonth, (sm) => sm.spot)
  spotMonths: SpotMonth[];

  /**
   * 所属的region
   */
  @ManyToOne(() => Region, (r) => r.spots)
  region: Region;

  /**
   * 是否删除
   */
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
