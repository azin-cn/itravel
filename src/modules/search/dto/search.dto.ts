import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Article } from 'src/entities/article.entity';
import { User } from 'src/entities/user.entity';

export class SearchDTO {
  /**
   * 搜索字符串
   */
  @ApiProperty({ description: '搜索字符串' })
  @IsString()
  @IsNotEmpty({ message: '搜索字符串为空' })
  s: string;
}

export class SearchResultDTO {
  /**
   * 符合搜索条件的用户
   */
  users: User[];
  /**
   * 扶额和搜索条件的文章
   */
  articles: Article[];
}
