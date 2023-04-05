import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { FeaturesService } from './features.service';

@ApiTags('特色')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('feature')
export class FeatureController {
  constructor(private featureService: FeaturesService) {}

  @ApiOperation({ summary: '获取特色信息' })
  @Get()
  async getFeatures(): Promise<ResultVO> {
    const features = await this.featureService.findAll();
    return ResultVO.success(features);
  }
}
