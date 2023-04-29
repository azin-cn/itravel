import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from 'src/entities/comment.entity';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { TransformCommentPipe } from 'src/shared/pipes/comment.pipe';
import { Assert } from 'src/utils/Assert';
import { TransformPaginationPipe } from 'src/shared/pipes/pagination.pipe';
import { PaginationOptions } from 'src/shared/dto/pagination.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentDTO } from './dto/comment.dto';
import { TransformUUIDPipe } from 'src/shared/pipes/uuid.pipe';
import { AuthorGuard } from 'src/shared/guards/author.guard';
import { Author } from 'src/shared/decorators/author.decorator';
import { AUTHOR_SCENE } from 'src/shared/constants/author.constant';

@ApiTags('评论')
@Controller('comment')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @ApiOperation({ summary: '通过文章获取评论' })
  @Get()
  async getCommentsByArticleId(
    @Query('articleId', ParseUUIDPipe) id: string,
    @Query(TransformPaginationPipe) options: PaginationOptions,
  ) {
    const {
      items,
      meta: { totalItems, itemCount, totalPages },
    } = await this.commentService.findFormatCommentsByArticleId(id, options);
    return ResultVO.list(items, totalItems);
  }

  @ApiOperation({ summary: '提交评论' })
  @ApiBody({ type: CommentDTO })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async postComment(@Body(TransformCommentPipe) comment: Comment) {
    const commentRep = await this.commentService.create(comment);
    Assert.assertNotNil(commentRep, '评论/回复失败');
    return ResultVO.success(commentRep);
  }

  @ApiOperation({ summary: '删除评论' })
  @ApiParam({ name: 'id' })
  @Author(AUTHOR_SCENE.ARTICLE)
  @UseGuards(AuthGuard('jwt'), AuthorGuard)
  @Delete(':id')
  async deleteComment(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO> {
    const { affected } = await this.commentService.delete(id);
    Assert.isNotZero(affected);
    return ResultVO.success();
  }
}
