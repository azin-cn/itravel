import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Region } from './region.entity';

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
  @Column({ type: 'tinytext' })
  fullName: string;

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
   * 所属的区域
   */
  @ManyToOne(() => Region, (r) => r.provinces)
  @JoinColumn()
  region: Region;
}
