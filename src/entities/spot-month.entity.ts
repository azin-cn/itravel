import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Month } from './month.entity';
import { Spot } from './spot.entity';
import { Exclude } from 'class-transformer';

/**
 * 更好地处理和存储每个月份与景点之间的关系，
 * 包括可能存在的一些其他信息（例如，一个景点在不同月份的推荐度可能不同，使用 spotmonth 可以更容易地处理这种情况）。
 * 此外，如果你需要为每个月份的景点推荐度设置特定的规则和算法，使用中间表也更方便你进行逻辑上的实现。
 */
@Entity()
export class SpotMonth {
  /**
   * SpotMonth id
   */
  @PrimaryGeneratedColumn('uuid', { comment: 'id' })
  id: string;

  /**
   * 推荐的景点
   */
  @ManyToOne(() => Spot, (s) => s.spotMonths)
  @JoinColumn()
  spot: Spot;

  /**
   * 推荐的月份
   */
  @ManyToOne(() => Month, (m) => m.spotMonths)
  @JoinColumn()
  month: Month;

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
