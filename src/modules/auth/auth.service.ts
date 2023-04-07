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
import { LoginResponseVO } from './dto/token.dto';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { MailerService } from '../mailer/mailer.service';
import { USER_STATUS } from 'src/shared/constants/user.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async generateToken(payload: any): Promise<string> {
    if (Object.getPrototypeOf(payload) !== Object.prototype) {
      /**
       * 如果不是一个普通对象，则转成一个普通对象
       */
      payload = instanceToPlain(payload);
    }

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

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findUserById(payload.getId());
    return user;
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
   * 通过 token 激活用户
   * @param token
   * @returns
   */
  async activateUserByToken(token: string): Promise<User> {
    const user = plainToClass(User, this.jwtService.verify(token));
    const userRep = await this.userService.findNotActiveUserById(user.id);
    Assert.isNotEmptyUser(userRep);
    userRep.status = USER_STATUS.ACTIVE;
    return this.userService.update(userRep);
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

    if (type === AUTH_TYPE.THIRD) {
      /**
       * 第三方注册
       */
    } else if (type === AUTH_TYPE.MOBILE) {
      /**
       * 手机号注册
       */
    } else if (type === AUTH_TYPE.ACCOUNT) {
      /**
       * 通过注册页面手动注册即邮件注册
       */
      return this.registerWithEmail(user);
    }

    return await this.userRepository.save(user);
  }

  /**
   * 邮箱注册激活
   * @param user
   * @returns
   */
  async registerWithEmail(user: User) {
    const { username, password, email } = user;
    Assert.assertNotNil(username);
    Assert.assertNotNil(password);
    Assert.assertNotNil(email);
    /**
     * 将用户名、密码、邮箱等数据保存在 Redis 中，形成以 token 为 key，User 为 value的结构
     * 目前将用户直接存入MySQL中，根据user数据生成token，最后active验证用户即可
     *
     * 更完善的功能是使用 redis 将注册用户的 token 设置为key，用户名、用户邮箱、密码设置为 value
     */
    user.status = 0;
    const userRep = await this.userRepository.save(user);
    const token = await this.generateToken(
      new JwtPayload(userRep.id, userRep.role, userRep.status),
    );

    /**
     * 通过 token 将邮件发送给注册用户
     */
    try {
      await this.mailerService.sendEMailForRegisterToken(email, token);
    } catch (error) {
      throw new BizException('服务出错，请联系管理员');
    }
    return user;
  }

  /**
   * 登录用户
   * @param u
   * @param type
   * @returns token
   */
  async login(u: UserAuthDTO, type: number): Promise<LoginResponseVO> {
    // 经过转换后，必然是具有唯一凭证的 User
    const user = this.transformUserFromAuthDTO(u);

    if (type === AUTH_TYPE.THIRD) {
      /**
       * 第三方登录
       */
      // TODO: 第三方登录逻辑
      throw new BadRequestException('暂不支持第三方登录');
    } else if (type === AUTH_TYPE.MOBILE) {
      /**
       * 手机验证码登录
       */
      throw new BadRequestException('暂不支持手机登录');
    } else if (type === AUTH_TYPE.ACCOUNT) {
      /**
       * 账户密码登录
       */
      Assert.assertNotNil(user.password, '密码不能为空');
      const userRep = await this.userService.findUserByUniqueParam(user);
      Assert.isNotEmptyUser(userRep);

      if (userRep) {
        /**
         * 登陆时用户存在，验证密码
         * 若密码不匹配则抛出异常
         * 若密码匹配则返回用户信息
         */
        const isPwdMatch = bcrypt.compareSync(user.password, userRep.password);
        if (!isPwdMatch) throw new BadRequestException('账户或密码错误');
        const { id, role, status, avatar } = userRep;
        const token = await this.generateToken(
          instanceToPlain(new JwtPayload(id, role, status)),
        );
        return new LoginResponseVO(token, { id, role, avatar });
      }
    }
  }

  /**
   * 手机验证码登录
   * @param user
   * @param u
   * @returns
   */
  async loginWithMobile(user: User, u: UserAuthDTO): Promise<User> {
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
