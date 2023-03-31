import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SearchDTO } from 'src/modules/search/dto/search.dto';
import { Validator } from './utils';

@Injectable()
export class TransformSearchPipe implements PipeTransform {
  async transform(
    value: SearchDTO,
    metadata: ArgumentMetadata,
  ): Promise<SearchDTO> {
    /**
     * 转换数据类型
     */
    value = plainToClass(SearchDTO, value);

    /**
     * 验证数据
     */
    await Validator.validate(value);

    return value;
  }
}
