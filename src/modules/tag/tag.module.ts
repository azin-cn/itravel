import { Module } from '@nestjs/common';
import { Tag } from '../../entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Article } from 'src/entities/article.entity';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, User, Article])],
  providers: [TagService],
})
export class TagModule {}
