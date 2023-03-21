import { BadRequestException, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Validator } from './utils';
import { AuthTypeDTO } from 'src/modules/auth/dto/auth.dto';

export class TrasnformAuthPipe implements PipeTransform {
  async transform(value: AuthTypeDTO): Promise<AuthTypeDTO> {
    // 默认情况下，query参数是字符串
    try {
      value = { ...value, type: Number(value.type) };
    } catch (error) {
      throw new BadRequestException('注册类型错误');
    }
    value = plainToClass(AuthTypeDTO, value);
    await Validator.validate(value);
    return value;
  }
}
