import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Spot } from './spot.entity';

@Entity()
export class District {
  /**
   * 县区id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 县区名称
   */
  @Column({ type: 'tinytext' })
  name: string;

  /**
   * 县区全名/官方名称
   */
  @Column({ type: 'tinytext', nullable: true })
  fullName: string;

  /**
   * 县区权重
   */
  @Column({ default: 0, type: 'tinyint' })
  weight: number;

  /**
   * 高德地图id
   */
  @Column({ nullable: true })
  aid: string;

  /**
   * 百度地图id
   */
  @Column({ nullable: true })
  bid: string;

  /**
   * 腾讯地图id
   */
  @Column({ nullable: true })
  tid: string;

  /**
   * 所属城市
   */
  @ManyToOne(() => City, (c) => c.districts)
  @JoinColumn()
  city: City;

  /**
   * 包含景点
   */
  @OneToMany(() => Spot, (s) => s.district)
  spots: Spot[];
}
