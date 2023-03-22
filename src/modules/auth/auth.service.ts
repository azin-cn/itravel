import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { isEmail, isMobilePhone } from 'class-validator';
import { Assert } from 'src/utils/Assert';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BizException } from 'src/shared/exceptions/BizException';
import { UserService } from '../user/user.service';
import { AUTH_TYPE } from 'src/shared/constants/auth.constant';
import { JwtPayload, UserAuthDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDTO } from './dto/token.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(UserService)
    private userService: UserService,
    @Inject(JwtService)
    private jwtService: JwtService,
  ) {}

  async generateToken(payload: any): Promise<string> {
    console.log(this.jwtService);
    const token = this.jwtService.sign(payload);
    return token;
  }

  async verifyToken(token: string): Promise<unknown> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      // return UnauthorizedException('未知用户');
      return null;
    }
  }

  /**
   * 实现从 UserAuthDTO 获取 User
   * @param u
   * @returns
   */
  transformUserFromAuthDTO(u: UserAuthDTO): User {
    const { account, username, phone, email, password } = u;
    const user = new User();
    // 至少需要一个凭证
    Assert.assertNotNil(account || username || phone || email);
    user.username = account || username;
    user.phone = isMobilePhone(account) ? account : phone;
    user.email = isEmail(account) ? account : email;
    user.password = password;
    return user;
  }

  /**
   * 注册用户
   * @param u
   * @param type
   * @returns
   */
  async register(u: UserAuthDTO, type: number): Promise<User> {
    const user = this.transformUserFromAuthDTO(u);
    const userRep = await this.userService.findUserByUniqueParam(user);
    if (userRep) {
      throw new BadRequestException('用户已存在');
    }
    return await this.userRepository.save(user);
  }

  /**
   * 登录用户
   * @param u
   * @param type
   * @returns token
   */
  async login(u: UserAuthDTO, type: number): Promise<LoginResponseDTO> {
    // 经过转换后，必然是具有唯一凭证的 User
    const user = this.transformUserFromAuthDTO(u);

    if (type === AUTH_TYPE.THIRD) {
      /**
       * 第三方登录
       */
      // TODO: 第三方登录逻辑
    } else if (type === AUTH_TYPE.MOBILE) {
      /**
       * 手机验证码登录
       */
    } else if (type === AUTH_TYPE.ACCOUNT) {
      /**
       * 账户密码登录
       */
      Assert.assertNotNil(user.password, '密码不能为空');
      const userRep = await this.userService.findUserByUniqueParam(user);
      if (userRep) {
        /**
         * 登陆时用户存在，验证密码
         * 若密码不匹配则抛出异常
         * 若密码匹配则返回用户信息
         */
        const isPwdMatch = bcrypt.compareSync(user.password, userRep.password);
        if (!isPwdMatch) throw new BizException('账户或密码错误');
        const { id, role, status } = userRep;
        const token = await this.generateToken(
          instanceToPlain(new JwtPayload(id, role, status)),
        );
        return new LoginResponseDTO(token, user);
      } else {
        /**
         * 若登录用户不不存在
         */
        throw new BizException('用户不存在');
      }
    }
  }

  /**
   * 手机验证码登录
   * @param user
   * @param u
   * @returns
   */
  async loginWithMOBILE(user: User, u: UserAuthDTO): Promise<User> {
    const { phone, captcha } = u;
    Assert.isMobilePhone(phone);
    Assert.assertNotNil(captcha);
    // TODO: 验证码逻辑
    return user;
  }

  /**
   * 第三方登录
   * @param user
   * @param u
   * @returns
   */
  async loginWithThird(user: User, u: UserAuthDTO): Promise<User> {
    return user;
  }
}
