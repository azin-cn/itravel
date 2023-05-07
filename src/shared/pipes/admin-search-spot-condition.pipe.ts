import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { SpotSearchDTO } from 'src/modules/admin/dto/admin.dto';
import { plainToInstance } from 'class-transformer';
import { Validator } from './utils';

@Injectable()
export class TransformAdminSearchSpotConditionsPipe implements PipeTransform {
  async transform(spotSearchDTO: SpotSearchDTO, metadata: ArgumentMetadata) {
    /**
     * 转换数据
     */
    spotSearchDTO = plainToInstance(SpotSearchDTO, spotSearchDTO);

    /**
     * 校验数据
     */
    console.log(spotSearchDTO);
    await Validator.validate(spotSearchDTO);

    return spotSearchDTO;
  }
}
