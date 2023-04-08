import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
   * AUTH_TYPE constraints
   */
  @ApiProperty({ description: '登录/注册类型', enum: AUTH_TYPE.getAll() })
  @IsNotEmpty({ message: '登录/注册 type 不能为空' })
  @IsIn(AUTH_TYPE.getAll(), { message: '登录/注册类型错误' })
  type: number;
}

/**
 * @class 用户认证类型
 */
export class UserAuthDTO extends UserBaseDTO {
  /**
   * 账户如手机、邮箱、用户名
   */
  @ApiProperty({ description: '账户如手机、邮箱、用户名' })
  @IsOptional()
  @Validate(IsAccount)
  account: string;

  /**
   * 验证码
   */
  @ApiPropertyOptional({ description: '验证码' })
  @IsOptional()
  @IsNumber()
  captcha?: number;
}

export class JwtPayload {
  constructor(
    private id?: string,
    private role?: number,
    private status?: number,
  ) {}

  @ApiPropertyOptional()
  public getId() {
    return this.id;
  }

  @ApiPropertyOptional()
  public setId(id: string) {
    this.id = id;
  }

  @ApiPropertyOptional()
  public getRole() {
    return this.role;
  }

  @ApiPropertyOptional()
  public setRole(role: number) {
    this.role = role;
  }

  @ApiPropertyOptional()
  public getStatus() {
    return this.status;
  }
  public setStatus(status: number) {
    this.status = status;
  }
}
