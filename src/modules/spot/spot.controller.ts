import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SpotService } from './spot.service';
import { TransformUUIDPipe } from 'src/shared/pipes/uuid.pipe';
import { Assert } from 'src/utils/Assert';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Month } from 'src/entities/month.entity';
import { TransformSpotDTOPipe } from 'src/shared/pipes/spot.pipe';
import { SpotDTO } from './dto/spot.dto';

@ApiTags('景点信息')
@Controller('spot')
export class SpotController {
  constructor(private spotService: SpotService) {}

  @ApiOperation({ description: '通过ID获取景点信息' })
  @ApiParam({ name: 'id' })
  @Get(':id')
  async getSpotById(@Param('id', TransformUUIDPipe) id: string) {
    const spot = await this.spotService.findSpotById(id);
    Assert.isNotEmptySpot(spot);
    return ResultVO.success(spot);
  }

  @ApiOperation({ description: '获取符合条件的景点' })
  // @ApiQuery({type:})
  @Get()
  async getSpotsByConditions(@Query() conditions) {
    //
  }

  /**
   * 更新景点
   */
  @ApiOperation({ description: '新增景点' })
  @Post()
  async postSpot(@Body(TransformSpotDTOPipe) spotDTO: SpotDTO) {
    // const spot = this.spotService.create();
    return ResultVO.success();
  }
}
