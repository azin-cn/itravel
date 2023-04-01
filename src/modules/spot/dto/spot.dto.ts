import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional({ description: '包含月份' })
  @IsOptional()
  @Validate((value) => {
    if (value instanceof Array) {
      value.forEach((item) => {
        if (!isUUID(item))
          throw new BadRequestException('months 元素必须是 UUID');
      });
    } else throw new BadRequestException('months 参数必须是 Array');
  })
  months: string[];

  @ApiPropertyOptional({ description: '包含特色' })
  @IsOptional()
  @Validate((value) => {
    if (value instanceof Array) {
      value.forEach((item) => {
        if (!isUUID(item))
          throw new BadRequestException('features 元素必须是 UUID');
      });
    } else throw new BadRequestException('features 参数必须是 Array');
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
