import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class ArticleBaseDTO {
  /**
   * 文章title
   */
  @ApiPropertyOptional({ name: 'username', description: '用户名称' })
  @IsNotEmpty({ message: '文章标题不为空' })
  @IsString({ message: '文章标题不是字符串' })
  @Length(6, 30, {
    message: '文章标题长度必须为 $constraint1 到 $constraint2 之间',
  })
  title: string;

  /**
   * 文章作者
   */
  @ApiProperty({ description: '文章作者id' })
  @IsNotEmpty({ message: '文章作者不存在' })
  @IsUUID(undefined, { message: '文章作者ID非UUID' })
  author: string; // uuid 为 key

  /**
   * 文章缩略图
   */
  @ApiPropertyOptional({ description: '文章缩略图' })
  @IsOptional()
  @IsUrl(undefined, { message: '缩略图不是正确URL' })
  thumbUrl: string;

  /**
   * 文章的简要
   */
  @ApiPropertyOptional({ description: '文章的简要' })
  @IsOptional()
  @IsString()
  @Length(0, 300, {
    message: '文章简要长度必须在 $constraint1 到 $constraint2 之间',
  })
  summary: string;

  /**
   * 文章内容
   */
  @ApiProperty({ description: '文章内容' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1, {
    message: '文章内容不为空',
  })
  content: string;
}

/**
 * @class 文章新增 DTO 对象
 */
export class ArticleDTO extends ArticleBaseDTO {
  @ApiPropertyOptional({ description: 'id' })
  @IsOptional()
  @IsUUID(undefined, { message: '文章ID非UUID' })
  id: string;
}
