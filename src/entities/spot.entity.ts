import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpotMonth } from './spot-month.entity';
import { SpotFeature } from './spot-feature.entity';
import { Province } from './province.entity';
import { City } from './city.entity';
import { District } from './district.entity';
import { Country } from './country.entity';
import { SpotCoordinate } from './spot-coordinate.entity';
import { Article } from './article.entity';

@Entity()
export class Spot {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * name
   */
  @Column({ type: 'tinytext' })
  name: string;

  /**
   * 简介
   */
  @Column({ type: 'mediumtext', nullable: true })
  description: string;

  /**
   * 包含的文章
   */
  @OneToMany(() => Article, (a) => a.spot)
  articles: Article[];

  /**
   * 使用spot-mongth中间表拓展更多信息
   */
  @OneToMany(() => SpotMonth, (sm) => sm.spot)
  spotMonths: SpotMonth[];

  /**
   * 使用spot-feature中间表推荐更多信息
   */
  @OneToMany(() => SpotFeature, (sf) => sf.spot)
  spotFeatures: SpotFeature[];

  /**
   * 旅游景点内的某些的坐标点
   */
  @OneToMany(() => SpotCoordinate, (sc) => sc.spot)
  spotCoordinates: SpotCoordinate[];

  /**
   * 包含的国家
   * TODO：未来实现不同国家
   */
  @ManyToOne(() => Country, (c) => c.spots)
  @JoinColumn()
  country: Country;

  /**
   * 所属省份
   */
  @ManyToOne(() => Province, (p) => p.spots)
  @JoinColumn()
  province: Province;

  /**
   * 所属城市
   */
  @ManyToOne(() => City, (c) => c.spots)
  @JoinColumn()
  city: City;

  /**
   * 包含的县区
   */
  @ManyToOne(() => District, (d) => d.spots)
  @JoinColumn()
  district: District;

  /**
   * 是否删除
   */
  @Column({ default: false })
  isDeleted: boolean;

  /**
   * 创建时间
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdTime: string;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedTime: string;
}
