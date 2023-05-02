import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpotFeature } from './spot-feature.entity';

@Entity()
export class Feature {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid', { comment: 'feature id' })
  id: string;

  /**
   * 特色名称
   */
  @Column({ type: 'tinytext', comment: '特色名称' })
  name: string;

  /**
   * spot-feature中间表关联
   */
  @OneToMany(() => SpotFeature, (sf) => sf.feature)
  spotFeatures: SpotFeature[];

  /**
   * 创建时间
   */
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdTime: string;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedTime: string;
}
