import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Spot } from './spot.entity';
import { Feature } from './feature.entity';

@Entity()
export class SpotFeature {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 对应的景点
   */
  @ManyToOne(() => Spot, (s) => s.spotFeatures)
  @JoinColumn()
  spot: Spot[];

  /**
   * 对应的特色
   */
  @ManyToOne(() => Feature, (f) => f.spotFeatures)
  @JoinColumn()
  feature: Feature;
}
