import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  Validate,
  isUUID,
} from 'class-validator';

export class SpotBaseDTO {
  /**
   * 景点名称
   */
  @ApiPropertyOptional({ description: '景点名称' })
  @IsOptional()
  @IsString({ message: '名称非字符串' })
  @MinLength(1, { message: '名称为空' })
  name: string;

  /**
   * 简介
   */
  @ApiPropertyOptional({ description: '简介' })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '简介为空' })
  description: string;

  /**
   * 所属的country id
   */
  @ApiPropertyOptional({ description: '所属的country id' })
  @IsOptional()
  @IsUUID()
  country: string;

  /**
   * 所属的province id
   */
  @ApiPropertyOptional({ description: '所属的province id' })
  @IsOptional()
  @IsUUID()
  province: string;

  /**
   * 所属的city id
   */
  @ApiPropertyOptional({ description: '所属的city id' })
  @IsOptional()
  @IsUUID()
  city: string;

  /**
   * 所属的district id
   */
  @ApiPropertyOptional({ description: '所属的district id' })
  @IsOptional()
  @IsUUID()
  district: string;

  @ApiPropertyOptional({ description: '包含的月份' })
  @IsOptional()
  @Transform(({ value }) => {
    /**
     * value string | undefined | null
     */
    if (value === undefined || value === null) {
      /**
       * 未传值
       */
      return null;
    } else if (value === '') {
      /**
       * 为空字符串但是返回需要空字符串数组
       */
      return [''];
    } else if (typeof value === 'string') {
      /**
       * 1,2,3,4 类型
       */
      const values = value
        .toString()
        .split(',')
        .map((item) => {
          item = item.trim();
          if (isUUID(item)) return item;
          throw new BadRequestException('months 元素必须是 UUID');
        });

      return values;
    }
    throw new BadRequestException('months 未知数据类型');
  })
  months: string[];

  @ApiPropertyOptional({ description: '包含的特色' })
  @IsOptional()
  @Transform(({ value }) => {
    /**
     * value string | undefined | null
     */
    if (value === undefined || value === null) {
      /**
       * 未传值
       */
      return null;
    } else if (value === '') {
      /**
       * 为空字符串但是返回需要空字符串数组
       */
      return [''];
    } else if (typeof value === 'string') {
      /**
       * 1,2,3,4 类型
       */
      const values = value
        .toString()
        .split(',')
        .map((item) => {
          item = item.trim();
          if (isUUID(item)) return item;
          throw new BadRequestException('features 元素必须是 UUID');
        });

      return values;
    }
    throw new BadRequestException('features 未知数据类型');
  })
  features: string[];
}

export class SpotDTO extends SpotBaseDTO {
  /**
   * id
   */
  @ApiPropertyOptional({ description: 'id' })
  @IsOptional()
  @IsUUID()
  id: string;
}
