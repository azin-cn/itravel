import { Controller, Get, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResultVO } from 'src/shared/vo/ResultVO';
import {
  TransformUUIDArrayPipe,
  TransformUUIDPipe,
} from 'src/shared/pipes/uuid.pipe';
@ApiTags('标签')
@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @ApiOperation({ summary: '根据用户id和关键字获取标签' })
  @Get('user')
  async getTagsByWordsAndUserId(
    @Query('id', TransformUUIDPipe) id: string,
    @Query('s') s: string,
  ): Promise<ResultVO> {
    const tags = await this.tagService.findTagsByWordsAndUserId(s, id);
    return ResultVO.success(tags);
  }

  @ApiOperation({ summary: '根据ids获取tag数组' })
  @Get('ids')
  async getTagsByIds(
    @Query('ids', TransformUUIDArrayPipe) ids: string[],
  ): Promise<ResultVO> {
    const tags = await this.tagService.findTagsByIds(ids);
    return ResultVO.success(tags);
  }
}
