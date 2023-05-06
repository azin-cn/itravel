import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ArticleModule } from '../article/article.module';
import { SpotModule } from '../spot/spot.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  controllers: [AdminController],
  imports: [SpotModule, ArticleModule, CommentModule],
  providers: [AdminService],
})
export class AdminModule {}
