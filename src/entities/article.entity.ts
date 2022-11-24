import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
