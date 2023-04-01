import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpotMonth } from './spot-month.entity';
import { Region } from './region.entity';
import { SpotFeature } from './spot-feature.entity';

@Entity()
export class Spot {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * name
   */
  @Column({ type: 'tinytext' })
  name: string;

  /**
   * 简介
   */
  @Column({ type: 'mediumtext', nullable: true })
  description: string;

  /**
   * 使用spot-mongth中间表拓展更多信息
   */
  @OneToMany(() => SpotMonth, (sm) => sm.spot)
  spotMonths: SpotMonth[];

  /**
   * 使用spot-feature中间表推荐更多信息
   */
  @OneToMany(() => SpotFeature, (sf) => sf.spot)
  spotFeatures: SpotFeature[];

  /**
   * 所属的region
   */
  @ManyToOne(() => Region, (r) => r.spots)
  @JoinColumn()
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
