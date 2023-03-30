import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ArticleService } from 'src/modules/article/article.service';
import { CommentDTO } from 'src/modules/comment/dto/comment.dto';
import { UserService } from 'src/modules/user/user.service';
import { Validator } from './utils';
import { Assert } from 'src/utils/Assert';
import { Comment } from 'src/entities/comment.entity';
import { CommentService } from 'src/modules/comment/comment.service';

@Injectable()
export class TransformCommentPipe implements PipeTransform {
  constructor(
    private userService: UserService,
    private articleService: ArticleService,
    private commentService: CommentService,
  ) {}

  async transform(commentDTO: CommentDTO, metadata: ArgumentMetadata) {
    /**
     * 转换数据类型
     */
    commentDTO = plainToClass(CommentDTO, commentDTO);

    /**
     * 校验数据格式
     */
    await Validator.validate(commentDTO);

    /**
     * 查询/校验Comment构成
     */
    const user = await this.userService.findActiveUserById(commentDTO.user);
    const toUser = await this.userService.findActiveUserById(commentDTO.toUser);
    const article = await this.articleService.findArticleById(
      commentDTO.article,
    );
    /**
     * 当parent为undefined时，typeorm会返回第一个数据，应将其设置为 ''
     */
    const parent = await this.commentService.findCommentById(
      commentDTO.parent || '',
    );
    Assert.isNotEmptyUser(user);
    Assert.isNotEmptyUser(toUser);
    Assert.isNotEmptyArticle(article);

    /**
     * 构成comment
     */
    const comment = new Comment();
    comment.user = user;
    comment.toUser = toUser;
    comment.article = article;
    comment.parent = parent;
    comment.content = commentDTO.content;

    return comment;
  }
}
