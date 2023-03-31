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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('搜索')
@Controller('search')
@UseInterceptors(ClassSerializerInterceptor)
export class SearchController {
  constructor(private searchService: SearchService) {}

  @ApiOperation({ description: '全局搜索' })
  @Get()
  async search(
    @Query(TransformSearchPipe) query: SearchDTO,
  ): Promise<ResultVO> {
    const { s } = query;
    const res = await this.searchService.search(s);
    return ResultVO.success(res);
  }
}
