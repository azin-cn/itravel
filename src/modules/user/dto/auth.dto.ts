import {} from '@nestjs/common';
import { IsIn, IsNotEmpty } from 'class-validator';
import { AUTH_TYPE } from 'src/shared/constants/auth.constant';

export class AuthTypeDTO {
  /**
   * 注册类型
   */
  @IsNotEmpty({ message: '注册 type 不能为空' })
  @IsIn(AUTH_TYPE.getAll(), { message: '注册类型错误' })
  type: number;
}
