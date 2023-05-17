import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import {
  SpotSearchDTO,
  ArticleSearchDTO,
} from 'src/modules/admin/dto/admin.dto';
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

@Injectable()
export class TransformAdminSearchArticleConditionsPipe
  implements PipeTransform
{
  async transform(
    articleSearchDTO: ArticleSearchDTO,
    metadata: ArgumentMetadata,
  ) {
    /**
     * 转换数据
     */
    articleSearchDTO = plainToInstance(ArticleSearchDTO, articleSearchDTO);

    /**
     * 校验数据
     */
    await Validator.validate(ArticleSearchDTO);

    return ArticleSearchDTO;
  }
}
