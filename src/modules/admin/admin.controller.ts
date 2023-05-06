import { Controller, Get } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { AdminService } from './admin.service';

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
}
