import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { UserModule } from '../user/user.module';
import { ArticleModule } from '../article/article.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [UserModule, ArticleModule, CommentModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
