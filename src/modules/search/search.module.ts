import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { UserModule } from '../user/user.module';
import { ArticleModule } from '../article/article.module';
import { CommentModule } from '../comment/comment.module';
import { SpotModule } from '../spot/spot.module';

@Module({
  imports: [UserModule, ArticleModule, CommentModule, SpotModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
