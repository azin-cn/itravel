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

  @ApiOperation({ summary: '模糊搜索景点' })
  @Get('spot')
  async searchSpot(
    @Query('s', TransformNotEmptyPipe) s: string,
    @Query(TransformPaginationPipe) options: PaginationOptions,
  ): Promise<ResultVO> {
    const {
      items,
      meta: { itemCount, totalItems },
    } = await this.searchService.searchSpot(s, options);
    return ResultVO.list(items, totalItems);
  }

  @ApiOperation({ summary: '模糊搜索文章' })
  @Get('article')
  async searchArticle(
    @Query('s', TransformNotEmptyPipe) s: string,
    @Query(TransformPaginationPipe) options: PaginationOptions,
  ): Promise<ResultVO> {
    const {
      items,
      meta: { itemCount, totalItems },
    } = await this.searchService.searchArticle(s, options);

    return ResultVO.list(items, totalItems);
  }

  @ApiOperation({ summary: '模糊搜索用户' })
  @Get('user')
  async searchUser(
    @Query('s', TransformNotEmptyPipe) s: string,
    @Query(TransformPaginationPipe) options: PaginationOptions,
  ): Promise<ResultVO> {
    const {
      items,
      meta: { itemCount, totalItems },
    } = await this.searchService.searchUser(s, options);
    return ResultVO.list(items, totalItems);
  }
}
