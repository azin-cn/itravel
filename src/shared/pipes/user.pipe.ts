import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Title } from 'src/entities/title.entity';
import { User } from 'src/entities/user.entity';
import { UserDTO } from 'src/modules/user/dto/user.dto';
import { BizException } from '../exceptions/BizException';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TransformUserPipe implements PipeTransform {
  // 如果参数名称和原有的一样，那么可以直接使用 ClassTransformerPipe
  async transform(u: Partial<UserDTO>): Promise<User> {
    // 将来自请求的数据进项转换
    u = plainToClass(UserDTO, u);

    // 开始校验转换类型后的数据
    const errors = await validate(u);

    if (errors.length) {
      const errMsg = errors
        .map((e) => {
          const constrains = e.constraints;
          return Object.values(constrains).join('; \n');
        })
        // 为避免返回过多数据，限制10条
        .filter((_, i) => i < 10)
        // 再次格式化换行
        .join('; \n');
      // log
      throw new BadRequestException(errMsg);
    }

    const user = new User();
    user.id = u.id;
    user.username = u.username;
    user.email = u.email;
    user.phone = u.phone;
    user.password = u.password;
    user.avatar = u.avatar;
    user.scenicArea = u.scenicArea;

    // uuid string, not number 0
    if (u.titleId) {
      const title = new Title();
      title.id = u.titleId;
      user.title = title;
    }
    return user;
  }
}
