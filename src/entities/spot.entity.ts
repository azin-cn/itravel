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
import { Exclude } from 'class-transformer';

@Entity()
export class Spot {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid', { comment: 'id' })
  id: string;

  /**
   * name
   */
  @Column({ type: 'tinytext', comment: '景点名称' })
  name: string;

  /**
   * 简介
   */
  @Column({ type: 'mediumtext', comment: '简介' })
  description: string;

  /**
   * 缩略图，创建时不为空
   */
  @Column({ type: 'text', comment: '缩略图' })
  thumbUrl: string;

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
   * 所属的国家
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
   * 景点全景图
   */
  @Column({ type: 'json', comment: '景点全景图' })
  panorama: string;

  /**
   * 是否删除
   */
  @Exclude()
  @Column({ default: false, comment: '是否删除' })
  isDeleted: boolean;

  /**
   * 创建时间
   */
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdTime: string;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedTime: string;
}
