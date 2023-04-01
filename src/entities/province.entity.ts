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
import { Region } from './region.entity';

@Entity()
export class Province {
  /**
   * 省份id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 省份名称
   */
  @Column({ type: 'tinytext' })
  name: string;

  /**
   * 省份全名/官方名称
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
   * 所属的区域
   */
  @ManyToOne(() => Region, (r) => r.provinces)
  @JoinColumn()
  region: Region;
}
