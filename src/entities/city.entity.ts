import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { District } from './district.entity';
import { Spot } from './spot.entity';

@Entity()
export class City {
  /**
   * 市id
   */
  @PrimaryGeneratedColumn('uuid', { comment: '市id' })
  id: string;

  /**
   * 市名称
   */
  @Column({ type: 'tinytext', comment: '市名称' })
  name: string;

  /**
   * 市全名/官方名称
   */
  @Column({ type: 'tinytext', nullable: true, comment: '市全名/官方名称' })
  fullName: string;

  /**
   * 城市权重
   */
  @Column({ default: 0, type: 'tinyint', comment: '城市权重' })
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
   * 所属省份
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
   * 包含景点
   */
  @OneToMany(() => Spot, (s) => s.city)
  spots: Spot[];
}
