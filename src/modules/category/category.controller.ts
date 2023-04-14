import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { TransformUUIDPipe } from 'src/shared/pipes/uuid.pipe';
@ApiTags('分类')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: '根据用户id获取分类' })
  @Get('user')
  async getCagetoriesByWordsAndUserId(
    @Query('id', TransformUUIDPipe) id: string,
    @Query('s') s: string,
  ): Promise<ResultVO> {
    const categories = await this.categoryService.findCategoriesByWordsAndUserId(s, id);
    return ResultVO.success(categories);
  }
}
