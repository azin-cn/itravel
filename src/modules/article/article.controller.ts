import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { TransformUUIDPipe } from 'src/shared/pipes/uuid.pipe';
import { Roles } from 'src/shared/decorators/role.decorator';
import { USER_ROLES } from 'src/shared/constants/user.constant';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { TransformArticlePipe } from 'src/shared/pipes/article.pipe';
import { Article } from 'src/entities/article.entity';
import { AuthorGuard } from 'src/shared/guards/author.guard';
import { Author } from 'src/shared/decorators/author.decorator';
import { AUTHOR_SCENE } from 'src/shared/constants/author.constant';

@ApiTags('文章')
@Controller('article')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @ApiOperation({ summary: '获取文章' })
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
  @Post()
  @Author(AUTHOR_SCENE.ARTICLE)
  @UseGuards(AuthGuard('jwt'), AuthorGuard)
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
}
