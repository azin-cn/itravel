import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from 'src/entities/comment.entity';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { TransformCommentPipe } from 'src/shared/pipes/comment.pipe';
import { Assert } from 'src/utils/Assert';

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
  async getComment(@Query('id') id:string){
    return await this.commentService.findFormatCommentsByArticleId(id)
  }
}
