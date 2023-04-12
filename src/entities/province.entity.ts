import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';
import { Spot } from './spot.entity';

@Entity()
export class Province {
  /**
   * 省份id
   */
  @PrimaryGeneratedColumn('uuid', { comment: '省份id' })
  id: string;

  /**
   * 省份名称
   */
  @Column({ type: 'tinytext', comment: '省份名称' })
  name: string;

  /**
   * 省份全名/官方名称
   */
  @Column({ type: 'tinytext', nullable: true, comment: '省份全名/官方名称' })
  fullName: string;

  /**
   * 省份权重
   */
  @Column({ default: 0, type: 'tinyint', comment: '省份权重' })
  weight: number;

  /**
   * 高德地图id
   */
  @Column({ nullable: true, comment: '高德地图id' })
  aid: string;

  /**
   * 百度地图id
   */
  @Column({ nullable: true, comment: '百度地图id' })
  bid: string;

  /**
   * 腾讯地图id
   */
  @Column({ nullable: true, comment: '腾讯地图id' })
  tid: string;

  /**
   * 所属国家
   */
  @ManyToOne(() => Country, (country) => country.provinces)
  @JoinColumn()
  country: Country;

  /**
   * 包含的城市
   */
  @OneToMany(() => City, (c) => c.province)
  cities: City[];

  /**
   * 包含景点
   */
  @OneToMany(() => Spot, (s) => s.province)
  spots: Spot[];
}
