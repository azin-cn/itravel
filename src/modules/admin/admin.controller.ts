import { TransformAdminSearchArticleConditionsPipe, TransformAdminSearchSpotConditionsPipe } from '../../shared/pipes/admin-search-condition.pipe';
import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { AdminService } from './admin.service';
import { TransformPaginationPipe } from 'src/shared/pipes/pagination.pipe';
import { PaginationOptions } from 'src/shared/dto/pagination.dto';
import { ArticleSearchDTO, SpotSearchDTO } from './dto/admin.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiOperation({ summary: '获取Counter数据' })
  @Get('workspace/counter')
  async getAdminWorkspaceCounter(): Promise<ResultVO> {
    const counter = await this.adminService.findWorkspaceCounter();
    return ResultVO.success(counter);
  }

  @ApiOperation({ summary: '获取Workspace总数据' })
  @Get('workspace')
  async getAdminWorkspace(): Promise<ResultVO> {
    const res = await this.adminService.findWorkspaceData();
    return ResultVO.success(res);
  }

  @ApiOperation({ summary: '查询景点数据' })
  @Get('spot/query')
  async getSpotsByConditions(
    @Query(TransformAdminSearchSpotConditionsPipe) conditions: SpotSearchDTO,
    @Query(TransformPaginationPipe) options: PaginationOptions,
  ): Promise<ResultVO> {
    const {
      items,
      meta: { totalItems },
    } = await this.adminService.findSpotsByConditions(conditions, options);
    return ResultVO.list(items, totalItems);
  }

  @ApiOperation({ summary: '查询文章数据' })
  @Get('article/query')
  async getArticlesByConditions(
    @Query(TransformAdminSearchArticleConditionsPipe) conditions: ArticleSearchDTO,
    @Query(TransformPaginationPipe) options: PaginationOptions,
  ): Promise<ResultVO> {
    const {
      items,
      meta: { totalItems },
    } = await this.adminService.findArticlesByConditions(conditions, options);
    return ResultVO.list(items, totalItems);
  }
}
