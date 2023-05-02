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
  @PrimaryGeneratedColumn('uuid', { comment: 'id' })
  id: string;

  /**
   * 坐标
   */
  @Column({ type: 'point', comment: '坐标' })
  point: Point;

  /**
   * 所属spot
   */
  @ManyToOne(() => Spot, (s) => s.spotCoordinates)
  @JoinColumn()
  spot: Spot;
}
