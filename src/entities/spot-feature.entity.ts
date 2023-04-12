import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Spot } from './spot.entity';
import { Feature } from './feature.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class SpotFeature {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid', { comment: 'id' })
  id: string;

  /**
   * 对应的景点
   */
  @ManyToOne(() => Spot, (s) => s.spotFeatures)
  @JoinColumn()
  spot: Spot;

  /**
   * 对应的特色
   */
  @ManyToOne(() => Feature, (f) => f.spotFeatures)
  @JoinColumn()
  feature: Feature;

  /**
   * 比重
   */
  @Column({ default: 0, type: 'tinyint', comment: '比重' })
  weight: number;

  /**
   * 是否删除
   */
  @Exclude()
  @Column({ default: false, comment: '是否删除' })
  isDeleted: boolean;

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
