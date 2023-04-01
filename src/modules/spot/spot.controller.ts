import { Controller, Get, Param } from '@nestjs/common';
import { SpotService } from './spot.service';
import { TransformUUIDPipe } from 'src/shared/pipes/uuid.pipe';
import { Assert } from 'src/utils/Assert';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

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
}
