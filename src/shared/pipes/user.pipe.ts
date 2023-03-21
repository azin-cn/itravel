import { Injectable, PipeTransform } from '@nestjs/common';
import { Title } from 'src/entities/title.entity';
import { User } from 'src/entities/user.entity';
import { UserAuthDTO, UserDTO } from 'src/modules/user/dto/user.dto';
import { plainToClass } from 'class-transformer';
import { Assert } from 'utils/Assert';
import { Validator } from './utils';

/**
 * User认证Pipe
 */
@Injectable()
export class TransformUserAuthPipe implements PipeTransform {
  async transform(u: UserAuthDTO): Promise<UserAuthDTO> {
    // 转换class
    u = plainToClass(UserAuthDTO, u);
    // 校验数据
    await Validator.validate(u);

    return u;
  }
}

/**
 * User Update Pipe
 */
@Injectable()
export class TransformUserPipe implements PipeTransform {
  // 如果参数名称和原有的一样，那么可以直接使用 ClassTransformerPipe
  async transform(u: UserDTO): Promise<User> {
    console.log(u);

    // 将来自请求的数据进项转换
    u = plainToClass(UserDTO, u);

    await Validator.validate(u);

    const user = new User();
    user.id = u.id;
    user.username = u.username;
    user.email = u.email;
    user.phone = u.phone;
    user.password = u.password;
    user.avatar = u.avatar;
    user.scenicArea = u.scenicArea;

    // uuid string, not number 0
    if (u.title) {
      const title = new Title();
      title.id = u.title;
      user.title = title;
    }
    return user;
  }
}
