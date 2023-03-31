import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

export class PaginationOptions {
  /**
   * 页面条数
   */
  @IsOptional()
  @Transform((value) => {
    if (value === undefined) return 20;
    return Number(value);
  })
  @Validate(({ value }) => {
    if (typeof value !== 'number')
      throw new BadRequestException('页面条数为无效数字');
    return true;
  })
  limit: number;

  /**
   * 页面
   * the page that is requested
   */
  @IsOptional()
  @Transform((value) => {
    if (value === undefined) return 1;
    return Number(value);
  })
  @Validate(({ value }) => {
    if (typeof value !== 'number')
      throw new BadRequestException('页码为无效数字');
    return true;
  })
  page: number;
}
