import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { USER_ROLES } from '../constants/user.constant';
import { Request } from 'express';
import { JwtPayload } from 'src/modules/auth/dto/auth.dto';
import { plainToClass } from 'class-transformer';
import { Assert } from 'src/utils/Assert';
import { USER_KEY } from '../constants/user.constant';
import { ArticleService } from 'src/modules/article/article.service';
import { AUTHOR_KEY, AUTHOR_SCENE } from '../constants/author.constant';

/**
 * 只允许对应的User进入
 */
@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    /**
     * reflector 用于从路由中获取元数据
     * 元数据通常是由 Controller 中注入，如使用装饰器注入，在请求中拦截请求对象并注入某些数据
     */
    private reflector: Reflector,

    private articleService: ArticleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * 在JwtStrategy中默认会将解析后的payload附加到request对象上，属性名可以指定，默认是user
     * 解析出名为 id 的参数，这可以通过@Param指定
     */
    const {
      user: payload,
      params: { id },
    } = context.switchToHttp().getRequest<Request>();

    Assert.assertNotNil(payload, 'token不存在或已过期');
    const user = plainToClass(JwtPayload, payload);

    /**
     * 通过 reflector 获取元数据
     */
    const authorScene = this.reflector.get<string>(
      AUTHOR_KEY,
      context.getHandler(),
    );
    Assert.assertNotNil(authorScene, '服务错误，检查 AuthorGuard 场景');

    if (authorScene === AUTHOR_SCENE.ARTICLE) {
      /**
       * 如果是文章中的 Guard
       */
      const article = await this.articleService.findArticleById(id);

      /**
       * 非空断言
       */
      Assert.isNotEmptyArticle(article);

      /**
       * token user_id 与 article author_id 比较
       */
      Assert.isEqual(user.getId(), article.author.id);

      return true;
    } else if (authorScene === AUTHOR_SCENE.TITLE) {
    } else if (authorScene === AUTHOR_SCENE.TAG) {
    }

    return false;
  }
}
