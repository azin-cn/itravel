import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SpotService } from './spot.service';
import {
  TransformUUIDArrayPipe,
  TransformUUIDPipe,
} from 'src/shared/pipes/uuid.pipe';
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

  @ApiOperation({ summary: '随机获取推荐景点' })
  // @ApiQuery({ type: SpotDTO })
  @Get('recom_spots/rand')
  async getRandRecommentSpots(
    @Query(TransformSpotDTOPipe) spotDTO: SpotDTO,
  ): Promise<ResultVO> {
    const spots = await this.spotService.findRandRecommentSpots(spotDTO);
    return ResultVO.success(spots);
  }

  @ApiOperation({ summary: '获取指定景点的feature和month' })
  @Get('fm/:id')
  async getSpotMonthAndFeatures(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO> {
    const spotFMInfo = await this.spotService.findSpotFeatureAndMonthById(id);
    Assert.assertNotNil(spotFMInfo);
    return ResultVO.success(spotFMInfo);
  }

  @ApiOperation({ summary: '获取景点的全景图' })
  @Get('panorama/:id')
  async getSpotPanorama(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO> {
    const spot = await this.spotService.findSpotPanoramaById(id);
    return ResultVO.success(spot);
  }

  /**
   * 根据关键字获取景点
   * @param s
   * @returns
   */
  @ApiOperation({ summary: '根据名称获取景点' })
  @Get('search')
  async getSpotByWords(@Query('s') s: string): Promise<ResultVO> {
    const spots = await this.spotService.findSpotsByWords(s);
    return ResultVO.success(spots);
  }

  @ApiOperation({ summary: '根据ids获取spot数组' })
  @Get('ids')
  async getSpotsByIds(
    @Query('ids', TransformUUIDArrayPipe) ids: string[],
  ): Promise<ResultVO> {
    const spots = await this.spotService.findSpotsByIds(ids);
    return ResultVO.success(spots);
  }

  @ApiOperation({ summary: '获取景点的简略信息(携带地址)' })
  @ApiParam({ name: 'id' })
  @Get(':id')
  async getSpotBriefInfoWithRegionById(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO> {
    const spot = await this.spotService.findSpotBriefInfoWithRegionById(id);
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
  @Patch(':id')
  async putSpot(
    @Body(TransformSpotDTOPipe) spotDTO: SpotDTO,
    @Param('id', TransformUUIDPipe) id: string,
  ) {
    const spot = await this.spotService.update(id, spotDTO);
    return ResultVO.success(spot);
  }

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
