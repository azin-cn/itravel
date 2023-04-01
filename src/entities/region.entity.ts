import { OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from './province.entity';
import { City } from './city.entity';
import { District } from './district.entity';
import { Spot } from './spot.entity';

export class Region {
  /**
   * 区域id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 包含的国家
   * TODO：未来实现不同国家
   */

  /**
   * 包含的省份
   */
  @OneToMany(() => Province, (p) => p.region)
  provinces: Province[];

  /**
   * 包含的市
   */
  @OneToMany(() => City, (c) => c.region)
  cities: City[];

  /**
   * 包含的县区
   */
  @OneToMany(() => District, (d) => d.region)
  districts: District[];

  /**
   * 包含的景点
   */
  @OneToMany(() => Spot, (s) => s.region)
  spots: Spot[];
}
