import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { UserModule } from '../user/user.module';
import { CommentModule } from '../comment/comment.module';
import { SpotModule } from '../spot/spot.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    UserModule,
    CategoryModule,
    CommentModule,
    SpotModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [TypeOrmModule.forFeature([Article]), ArticleService],
})
export class ArticleModule {}
