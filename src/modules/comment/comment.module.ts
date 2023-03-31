import { Module, forwardRef } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { ArticleModule } from '../article/article.module';
import { CommentController } from './comment.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UserModule,
    forwardRef(() => ArticleModule),
  ],
  providers: [CommentService],
  exports: [TypeOrmModule.forFeature([Comment]), CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
