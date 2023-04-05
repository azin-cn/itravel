import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { MonthsService } from './months.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResultVO } from 'src/shared/vo/ResultVO';

@ApiTags('月份')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('month')
export class MonthController {
  constructor(private monthService: MonthsService) {}

  @ApiOperation({ summary: '获取月份信息' })
  @Get()
  async getMonths(): Promise<ResultVO> {
    const months = await this.monthService.findAll();
    return ResultVO.success(months);
  }
}
