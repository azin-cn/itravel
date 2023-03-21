import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';
import { UserBaseDTO } from 'src/modules/user/dto/user.dto';
import { AUTH_TYPE } from 'src/shared/constants/auth.constant';
import { IsAccount } from 'src/shared/validators/IsAccount.validator';

export class AuthTypeDTO {
  /**
   * 注册类型
   */
  @IsNotEmpty({ message: '注册 type 不能为空' })
  @IsIn(AUTH_TYPE.getAll(), { message: '注册类型错误' })
  type: number;
}

/**
 * @class 用户认证类型
 */
export class UserAuthDTO extends UserBaseDTO {
  /**
   * 账户如手机、邮箱、用户名
   */
  @IsNotEmpty({ message: '请输入账户名如手机、邮箱、用户名' })
  @Validate(IsAccount)
  account: string;

  /**
   * 验证码
   */
  @IsOptional()
  @IsNumber()
  captcha?: number;
}
