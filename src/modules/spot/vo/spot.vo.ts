import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class SpotBaseVO {
  /**
   * 景点id
   */
  @ApiProperty({ description: '景点id' })
  id: string;

  /**
   * 景点名称
   */
  @ApiProperty({ description: '景点名称' })
  name: string;

  /**
   * 景点简介
   */
  @ApiProperty({ description: '景点简介' })
  description: string;

  /**
   * 缩略图
   */
  @ApiProperty({ description: '缩略图' })
  thumbUrl: string;

  /**
   * 权重
   */
  @ApiProperty({ description: '权重' })
  @Transform(({ value }) => Number(value))
  weight: number;
}

export class SpotCountVO {
  /**
   * 区域id
   */
  @ApiProperty({ description: '区域id' })
  id: string;

  /**
   * 区域名称
   */
  @ApiProperty({ description: '区域名称' })
  name: string;

  /**
   * 区域全名
   */
  @ApiProperty({ description: '区域全名' })
  fullName: string;
  /**
   * 景点数量
   */
  @ApiProperty({ description: '景点数量' })
  @Transform(({ value }) => Number(value))
  value: number;
}

export class SpotBriefVO extends SpotBaseVO {}
