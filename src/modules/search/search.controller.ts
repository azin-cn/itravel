import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { TransformSearchPipe } from 'src/shared/pipes/search.pipe';
import { SearchDTO } from './dto/search.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationOptions } from 'src/shared/dto/pagination.dto';
import { TransformPaginationPipe } from 'src/shared/pipes/pagination.pipe';
import { TransformNotEmptyPipe } from 'src/shared/pipes/not-empty.pipe';

@ApiTags('搜索')
@Controller('search')
@UseInterceptors(ClassSerializerInterceptor)
export class SearchController {
  constructor(private searchService: SearchService) {}

  @ApiOperation({ description: '模糊搜索文章' })
  @ApiQuery({ type: String, example: 'ac23600f-35ea-4bc6-8801-73974151c930' })
  @Get('article')
  async searchArticle(
    @Query('s', TransformNotEmptyPipe) s: string,
    @Query(TransformPaginationPipe) options: PaginationOptions,
  ): Promise<ResultVO> {
    const {
      items,
      meta: { itemCount },
    } = await this.searchService.searchArticle(s, options);

    return ResultVO.list(items, itemCount);
  }

  @ApiOperation({ description: '模糊搜索用户' })
  @ApiQuery({ type: String, example: 'ac23600f-35ea-4bc6-8801-73974151c930' })
  @ApiQuery({ type: PaginationOptions })
  @Get('user')
  async searchUser(
    @Query('s', TransformNotEmptyPipe) s: string,
    @Query(TransformPaginationPipe) options: PaginationOptions,
  ): Promise<ResultVO> {
    const {
      items,
      meta: { itemCount },
    } = await this.searchService.searchUser(s, options);

    return ResultVO.list(items, itemCount);
  }
}
