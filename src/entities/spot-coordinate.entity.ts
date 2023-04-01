import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Point,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spot } from './spot.entity';

@Entity()
export class SpotCoordinate {
  /**
   * id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 坐标
   */
  @Column({ type: 'point' })
  point: Point;

  /**
   * 所属spot
   */
  @ManyToOne(() => Spot, (s) => s.spotCoordinates)
  @JoinColumn()
  spot: Spot;
}
