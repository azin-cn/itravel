import {
  BadRequestException,
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
@Injectable()
export class TransformUUIDPipe implements PipeTransform {
  transform(value: string) {
    const isuuid = isUUID(value);
    if (!isuuid) {
      throw new BadRequestException('请求ID必须是UUID类型');
    }
    return value;
  }
}

@Injectable()
export class TransformUUIDArrayPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string[] {
    const uuids = value.split(',').map((item) => {
      item = item.trim();
      if (!isUUID(item)) {
        throw new BadRequestException('请求ID必须是UUID类型');
      }
      return item;
    });
    return uuids;
  }
}
