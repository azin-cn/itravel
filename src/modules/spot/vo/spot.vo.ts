import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { camelCase } from 'lodash';

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
