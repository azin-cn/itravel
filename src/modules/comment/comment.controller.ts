import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from 'src/entities/comment.entity';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { TransformCommentPipe } from 'src/shared/pipes/comment.pipe';
import { Assert } from 'src/utils/Assert';
import { TransformPaginationPipe } from 'src/shared/pipes/pagination.pipe';
import { PaginationOptions } from 'src/shared/dto/pagination.dto';

@Controller('comment')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  async postComment(@Body(TransformCommentPipe) comment: Comment) {
    const commentRep = await this.commentService.create(comment);
    Assert.assertNotNil(commentRep, '评论/回复失败');
    return ResultVO.success(commentRep);
  }

  @Get()
  async getCommentsByArticleId(
    @Query('articleId', ParseUUIDPipe) id: string,
    @Query(TransformPaginationPipe) options: PaginationOptions,
  ) {
    const {
      items,
      meta: { totalItems, itemCount, totalPages },
    } = await this.commentService.findFormatCommentsByArticleId(id, options);
    return ResultVO.list(items, itemCount);
  }
}
