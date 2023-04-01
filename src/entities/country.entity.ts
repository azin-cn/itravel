import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from './province.entity';
import { Spot } from './spot.entity';

@Entity()
export class Country {
  /**
   * 国家id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 国家名称
   */
  @Column({ type: 'tinytext' })
  name: string;

  /**
   * 国家名称/官方名称
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
