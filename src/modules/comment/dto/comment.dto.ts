import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { COMMENT_LENGTH } from 'src/shared/constants/comment.constant';

export class CommentBaseDTO {
  /**
   * 回复人id
   */
  @ApiProperty({ description: '回复人id' })
  @IsNotEmpty({ message: '回复人 id 不存在' })
  @IsUUID(undefined, { message: '回复用户 id 非 UUID 形式' })
  user: string;

  /**
   * 被回复人id
   */
  @ApiProperty({ description: '被回复人id' })
  @IsNotEmpty({ message: '被回复人 id 不存在' })
  @IsUUID(undefined, { message: '被回复用户 id 非 UUID 形式' })
  toUser: string;

  /**
   * 文章id
   */
  @ApiProperty({ description: '文章id' })
  @IsNotEmpty({ message: '文章 id 不存在' })
  @IsUUID(undefined, { message: '文章 id 非 UUID 形式' })
  article: string;

  /**
   * 评论/回复内容
   */
  @ApiProperty({ description: '评论/回复内容' })
  @IsNotEmpty({ message: '回复内容为空' })
  @IsString()
  @Length(COMMENT_LENGTH.MIN, COMMENT_LENGTH.MAX, {
    message: '评论长度须在 $constraint1 到 $constraint2 之间',
  })
  content: string;

  /**
   * 回复父级，即根品论
   */
  @ApiProperty({ description: '回复父级，即根品论' })
  @IsOptional()
  @IsUUID(undefined, { message: '父 id 非 UUID 形式' })
  parent: string;
}

export class CommentDTO extends CommentBaseDTO {
  /**
   * 评论/回复id
   */
  @ApiProperty({ description: '评论/回复id' })
  @IsOptional()
  @IsUUID(undefined, { message: '评论 id 非 UUID 形式' })
  id: string;
}
