import {
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { District } from './district.entity';
import { Region } from './region.entity';

export class City {
  /**
   * 市id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 市名称
   */
  @Column({ type: 'tinytext' })
  name: string;

  /**
   * 市全名/官方名称
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
  @ManyToOne(() => Province, (p) => p.cities)
  @JoinColumn()
  province: Province;

  /**
   * 包含的市县
   */
  @OneToMany(() => District, (d) => d.city)
  districts: District[];

  /**
   * 所属的区域
   */
  @ManyToOne(() => Region, (r) => r.provinces)
  @JoinColumn()
  region: Region;
}