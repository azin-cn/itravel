import { BadRequestException, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

export class TransformUUIDPipe implements PipeTransform {
  transform(value: string) {
    const isuuid = isUUID(value);
    if (!isuuid) {
      throw new BadRequestException('请求ID必须是UUID类型');
    }
    return value;
  }
}
