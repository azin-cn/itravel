import { SetMetadata } from '@nestjs/common';
import { AUTHOR_KEY } from '../constants/author.constant';

/**
 * 在当前的请求对象中附加数据
 * This metadata can be reflected using the Reflector class.
 * 用于判断不同情况下如Article更新时，Tag更新时的Author是否为其对应的Author，举例：只有作者才有权限更新自己的文章
 * Author装饰器是为了服用AuthorGuard而产生的向request对象中附加数据author
 * @param author
 * @returns
 */
export const Author = (author: string) => SetMetadata(AUTHOR_KEY, author);
