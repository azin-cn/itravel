import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { PAGINATION_DEFAULT } from '../constants/pagination.constant';

export class PaginationOptions {
  /**
   * 页面条数
   */
  @ApiProperty({ description: '页面条数' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return PAGINATION_DEFAULT.LIMIT;
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
  @ApiProperty({ description: '页码' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return PAGINATION_DEFAULT.PAGE;
    return Number(value);
  })
  @Validate(({ value }) => {
    if (typeof value !== 'number')
      throw new BadRequestException('页码为无效数字');
    return true;
  })
  page: number;
}
