import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SpotService } from './spot.service';
import { TransformUUIDPipe } from 'src/shared/pipes/uuid.pipe';
import { Assert } from 'src/utils/Assert';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TransformSpotDTOPipe } from 'src/shared/pipes/spot.pipe';
import { SpotDTO } from './dto/spot.dto';

@ApiTags('景点')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('spot')
export class SpotController {
  constructor(private spotService: SpotService) {}

  @ApiOperation({ summary: '通过ID获取景点信息' })
  @ApiParam({ name: 'id' })
  @Get(':id')
  async getSpotById(@Param('id', TransformUUIDPipe) id: string) {
    const spot = await this.spotService.findSpotById(id);
    Assert.isNotEmptySpot(spot);
    return ResultVO.success(spot);
  }

  @ApiOperation({ summary: '获取符合条件的景点' })
  @Get()
  async getSpotsByConditions(@Query(TransformSpotDTOPipe) conditions: SpotDTO) {
    //
  }

  /**
   * 新增景点
   */
  @ApiOperation({ summary: '新增景点' })
  @Post()
  async postSpot(@Body(TransformSpotDTOPipe) spotDTO: SpotDTO) {
    const spot = await this.spotService.create(spotDTO);
    return ResultVO.success();
  }

  /**
   * 更新景点
   */
  @ApiOperation({ summary: '更新景点' })
  @Put()
  async putSpot(@Body(TransformSpotDTOPipe) spotDTO: SpotDTO) {}

  /**
   * 测试新增数据
   * @returns 测试景点信息
   */
  @ApiOperation({ summary: '测试新增' })
  @Post('test')
  async testSpot() {
    return ResultVO.success();
  }
}
