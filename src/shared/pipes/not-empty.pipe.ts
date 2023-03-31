import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { Assert } from 'src/utils/Assert';

export class TransformNotEmptyPipe<T = unknown> implements PipeTransform {
  async transform(value: T, metadata: ArgumentMetadata): Promise<T> {
    Assert.assertNotNil(value);
    return value;
  }
}
