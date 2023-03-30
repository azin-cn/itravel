import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), ArticleModule],
  providers: [CommentService],
  exports: [TypeOrmModule.forFeature([Comment]), CommentService],
})
export class CommentModule {}
