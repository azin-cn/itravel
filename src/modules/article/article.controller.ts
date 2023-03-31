import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TransformUUIDPipe } from 'src/shared/pipes/uuid.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { TransformArticlePipe } from 'src/shared/pipes/article.pipe';
import { Article } from 'src/entities/article.entity';
import { AuthorGuard } from 'src/shared/guards/author.guard';
import { Author } from 'src/shared/decorators/author.decorator';
import { AUTHOR_SCENE } from 'src/shared/constants/author.constant';
import { Assert } from 'src/utils/Assert';
import { ArticleDTO } from './dto/article.dto';

@ApiTags('文章')
@Controller('article')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @ApiOperation({ summary: '获取文章' })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async getArticleById(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO> {
    const article = await this.articleService.findArticleById(id);
    return ResultVO.success(article);
  }

  /**
   * 创建文章
   * @param article
   * @returns
   */
  @ApiOperation({ summary: '创建文章' })
  @ApiBody({ type: ArticleDTO })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async postArticle(
    @Body(TransformArticlePipe) article: Article,
  ): Promise<ResultVO> {
    const articleRep = await this.articleService.create(article);
    return ResultVO.success(articleRep);
  }

  /**
   * 更新文章
   * @param id
   * @param article
   * @returns
   */
  @ApiOperation({ summary: '更新文章' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: ArticleDTO })
  @Put(':id')
  @Author(AUTHOR_SCENE.ARTICLE)
  @UseGuards(AuthGuard('jwt'), AuthorGuard)
  async putArticle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(TransformArticlePipe) article: Article,
  ) {
    const articleRep = await this.articleService.update(id, article);
    return ResultVO.success(articleRep);
  }
  /**
   * 删除文章
   * @param id
   * @returns
   */
  @ApiOperation({ description: '删除文章' })
  @ApiParam({ name: 'id', type: String })
  @Author(AUTHOR_SCENE.ARTICLE)
  @UseGuards(AuthGuard('jwt'), AuthorGuard)
  @Delete(':id')
  async deleteArticle(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO> {
    const { affected } = await this.articleService.delete(id);
    Assert.isNotZero(affected, '文章删除失败');
    return ResultVO.success();
  }
}
