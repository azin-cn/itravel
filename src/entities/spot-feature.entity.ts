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

@Entity()
export class SpotFeature {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 对应的景点
   */
  @ManyToOne(() => Spot, (s) => s.spotFeatures)
  @JoinColumn()
  spot: Spot[];

  /**
   * 对应的特色
   */
  @ManyToOne(() => Feature, (f) => f.spotFeatures)
  @JoinColumn()
  feature: Feature;

  /**
   * 比重
   */
  @Column({ default: 0, type: 'tinyint' })
  weight: number;

  /**
   * 是否删除
   */
  @Column({ default: false, comment: '' })
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
