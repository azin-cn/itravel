import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SpotDTO } from 'src/modules/spot/dto/spot.dto';
import { Validator } from './utils';
import { Spot } from 'src/entities/spot.entity';

@Injectable()
export class TransformSpotDTOPipe implements PipeTransform {
  async transform(
    spotDTO: SpotDTO,
    metadata: ArgumentMetadata,
  ): Promise<SpotDTO> {
    /**
     * 转换数据
     */
    spotDTO = plainToClass(SpotDTO, spotDTO);

    /**
     * 校验数据
     */
    await Validator.validate(spotDTO);

    return spotDTO;
  }
}
