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
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TransformSpotDTOPipe } from 'src/shared/pipes/spot.pipe';
import { SpotDTO } from './dto/spot.dto';
import { SpotCountVO } from './vo/spot.vo';

@ApiTags('景点')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('spot')
export class SpotController {
  constructor(private spotService: SpotService) {}

  @ApiOperation({ summary: '获取区域的景点个数' })
  @ApiOkResponse({ type: ResultVO<SpotCountVO> })
  @Get('area_counts')
  async getSpotCountsByConditions(
    @Query(TransformSpotDTOPipe) spotSTO: SpotDTO,
  ): Promise<ResultVO<SpotCountVO[]>> {
    const counts = await this.spotService.findAreaSpotCountsByConditions(
      spotSTO,
    );
    return ResultVO.success(counts);
  }

  /**
   * 获取符合条件的景点数组
   * @param SpotDTO
   */
  @ApiOperation({ summary: '获取符合条件的景点' })
  @Get('area_spots')
  async getSpotsByConditions(
    @Query(TransformSpotDTOPipe) spotDTO: SpotDTO,
  ): Promise<ResultVO> {
    const spots = await this.spotService.findSpotsByConditions(spotDTO);
    return ResultVO.success(spots);
  }

  @ApiOperation({ summary: '通过ID获取景点信息' })
  @ApiParam({ name: 'id' })
  @Get(':id')
  async getSpotById(@Param('id', TransformUUIDPipe) id: string) {
    const spot = await this.spotService.findSpotById(id);
    Assert.isNotEmptySpot(spot);
    return ResultVO.success(spot);
  }

  /**
   * 新增景点
   */
  @ApiOperation({ summary: '新增景点' })
  @Post()
  async postSpot(@Body(TransformSpotDTOPipe) spotDTO: SpotDTO) {
    const spot = await this.spotService.create(spotDTO);
    return ResultVO.success(spot);
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
