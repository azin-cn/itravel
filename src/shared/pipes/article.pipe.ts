import { ArgumentMetadata, Inject, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ArticleDTO } from 'src/modules/article/dto/article.dto';
import { Validator } from './utils';
import { Article } from 'src/entities/article.entity';
import { UserService } from 'src/modules/user/user.service';
import { Assert } from 'src/utils/Assert';

export class TransformArticlePipe implements PipeTransform {
  constructor(
    @Inject(UserService)
    private userService: UserService,
  ) {}
  async transform(articleDTO: ArticleDTO, metadata: ArgumentMetadata) {
    /**
     * 转换数据类型
     */
    articleDTO = plainToClass(ArticleDTO, articleDTO);

    /**
     * 校验所需数据
     */
    await Validator.validate(articleDTO);

    const article = new Article();
    article.title = articleDTO.title;
    article.content = articleDTO.content;
    article.summary = articleDTO.summary;
    article.thumbUrl = articleDTO.thumbUrl;
    const author = await this.userService.findUserById(articleDTO.author);
    Assert.isNotEmptyUser(author, '作者不存在或已删除');
    article.author = author;

    return article;
  }
}
