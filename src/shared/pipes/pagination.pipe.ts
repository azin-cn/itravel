import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { PaginationOptions } from '../dto/pagination.dto';
import { Validator } from './utils';
import { plainToClass } from 'class-transformer';
import { PAGINATION_DEFAULT } from '../constants/pagination.constant';

export class TransformPaginationPipe implements PipeTransform {
  async transform(value: PaginationOptions, metadata: ArgumentMetadata) {
    /**
     * 默认数据
     */
    value.limit ||= PAGINATION_DEFAULT.LIMIT;
    value.page ||= PAGINATION_DEFAULT.PAGE;

    if (value.page <= 0) value.page = PAGINATION_DEFAULT.PAGE;

    /**
     * 转换数据格式
     */
    value = plainToClass(PaginationOptions, value);

    /**
     * 校验数据
     */
    Validator.validate(value);

    return value;
  }
}
