import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsMobilePhone,
  IsEmail,
  IsUrl,
  IsNumber,
  IsOptional,
  Length,
} from 'class-validator';

/**
 * @class 用户常用信息
 */
export class UserBaseDTO {
  /**
   * 用户名称
   */
  @ApiProperty({ name: '用户名称' })
  @IsOptional()
  @IsString({ message: '用户名必须是字符串！' })
  @Length(6, 20, {
    message: '用户名长度必须为 $constraint1 到 $constraint2 之间',
  })
  username?: string;

  /**
   * 用户密码
   */
  @ApiProperty({ name: '用户密码' })
  @IsOptional()
  @IsString({ message: '密码必须是字符串！' })
  @Length(6, 20, {
    message: '密码长度必须为 $constraint1 到 $constraint2 之间',
  })
  password?: string;

  /**
   * 用户号码
   */
  @ApiProperty({ name: '用户号码' })
  @IsOptional()
  @IsMobilePhone(undefined, undefined, { message: '请输入正确的手机号码' })
  phone?: string;

  /**
   * 用户邮箱
   */
  @ApiProperty({ name: '用户邮箱' })
  @IsOptional()
  @IsEmail({}, { message: '请输入正确的邮箱地址！' })
  email?: string;
}

/**
 * @class 用户数据传输类型
 */
export class UserDTO extends UserBaseDTO {
  /**
   * uuid
   */
  // @IsNotEmpty({ message: '用户ID必须存在' })
  @ApiProperty({ name: '用户id uuid' })
  @IsOptional()
  @IsUUID(undefined, { message: '用户ID必须是UUID形式' })
  id: string;

  /**
   * 用户头像
   */
  @ApiProperty({ name: '用户头像' })
  @IsOptional()
  @IsUrl(undefined, { message: 'avatar 必须是 URL' })
  avatar?: string;

  /**
   * 用户简介
   */
  @ApiProperty({ name: '用户简介' })
  @IsOptional()
  @IsString({ message: '自我简介必须是字符串！' })
  @Length(6, 20, {
    message: '用户名长度必须为 $constraint1 到 $constraint2 之间',
  })
  description?: string;

  /**
   * 是否为园区，在审核通过后，可以选择自己更换标识
   */
  @ApiProperty({ name: '园区标识' })
  @IsOptional()
  @IsNumber(undefined, { message: 'scenicArea 必须是 number 类型' })
  scenicArea?: number;

  /**
   * 用户头衔Id
   */
  @ApiProperty({ name: '用头头衔id' })
  @IsOptional()
  @IsUUID(undefined, { message: '头衔 ID 必须是 UUID 形式' })
  title?: string;
}
