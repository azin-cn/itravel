import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from './province.entity';
import { Spot } from './spot.entity';

@Entity()
export class Country {
  /**
   * 国家id
   */
  @PrimaryGeneratedColumn('uuid', { comment: '国家id' })
  id: string;

  /**
   * 国家名称
   */
  @Column({ type: 'tinytext', comment: '国家名称' })
  name: string;

  /**
   * 国家名称/官方名称
   */
  @Column({ type: 'tinytext', nullable: true, comment: '国家名称/官方名称' })
  fullName: string;

  /**
   * 国家权重
   */
  @Column({ default: 0, type: 'tinyint', comment: '国家权重' })
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
   * 包含城市
   */
  @OneToMany(() => Province, (p) => p.country)
  provinces: Province[];

  /**
   * 包含景点
   */
  @OneToMany(() => Spot, (s) => s.country)
  spots: Spot[];
}
