import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

export class Validator {
  static async validate<T extends object>(u: T) {
    // 开始校验转换类型后的数据
    const errors = await validate(u);

    if (errors.length) {
      // const errMsg = errors
      //   .map((e) => {
      //     const constrains = e.constraints;
      //     return Object.values(constrains).join('; \n');
      //   })
      //   // 为避免返回过多数据，限制6条
      //   .filter((_, i) => i < 6)
      //   // 再次格式化换行
      //   .join('; \n');
      const errMsg = errors.map((e) => {
        const constrains = e.constraints;
        return Object.values(constrains)[0];
      })[0];
      // log
      console.log('errMsg, ', errMsg);
      throw new BadRequestException(errMsg);
    }
  }
}
