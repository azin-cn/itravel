import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SpotMonth } from './spot-month.entity';

export class Month {
  /**
   * 月份id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 月份名称
   */
  @Column({ type: 'tinytext' })
  name: string;

  /**
   * 推荐的月份景点对象，包括推荐度等更多拓展数据
   */
  @OneToMany(() => SpotMonth, (spotMonth) => spotMonth.month)
  spotMonths: SpotMonth[];
}
