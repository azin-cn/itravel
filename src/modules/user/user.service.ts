import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/entities/user.entity';
import { Title } from 'src/entities/title.entity';
import { BizException } from 'src/shared/exceptions/BizException';
import { AUTH_TYPE } from 'src/shared/constants/auth.constant';
import { Assert } from 'utils/Assert';
import { TitleService } from '../title/title.service';
import { UserAuthDTO } from './dto/user.dto';
import { isEmail, isMobilePhone } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    // 此语句只是适配Repository的返回存储库类型，并且加入到nest中，因而显得很多步骤
    // 其实流程很简单，Repository是typeorm提供的存储库类型，而nestjs需要动态的管理这一个存储库类型，
    // 所以nestjs在TypeOrm.forFeature中标识了需要存储这一类型，在InjectRepository中将这一类型依赖注入
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Title)
    private titleRepository: Repository<Title>,
    @Inject(TitleService)
    private titleService: TitleService,
  ) {}

  /**
   * 查找所有用户
   * @returns
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { isDeleted: false },
    });
  }

  /**
   * 通过ID查找用户
   * @param id
   * @returns
   */
  async findUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id, isDeleted: false });
  }

  /**
   * 查找所有用户，管理员模式
   * @returns 所有用户，包括已删除
   */
  async findAllAdmin() {
    return this.userRepository.find();
  }

  /**
   * 通过ID查找用户，管理员模式
   * @param id
   * @returns 寻找用户，包括已删除
   */
  async findUserByIdAdmin(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * 通过唯一条件查找用户
   * 唯一条件：用户名、手机、邮箱
   * @param _user
   */
  async findUserByUniqueParam(user: User): Promise<User> {
    return this.findUserByUniqueParamAdmin(user, false);
  }

  /**
   * 通过唯一条件查找用户，管理员模式
   * @param _user
   * @param isDeleted
   * @returns
   */
  async findUserByUniqueParamAdmin(_user: User, isDeleted = true) {
    const { username, phone, email } = _user;
    const handle = this.userRepository.createQueryBuilder('user');
    // .select(['username', 'phone', 'email']);
    handle.where(
      '(user.username = :username OR user.phone = :phone OR user.email = :email)',
      { username, phone, email },
    );
    if (!isDeleted) {
      // isDeleted 只在 为false时起效，不代表不查询已删除
      handle.andWhere('user.is_deleted = :isDeleted', { isDeleted });
    }
    return handle.getOne();
  }

  /**
   * 创建新用户
   * @param user
   * @returns
   */
  async create(user: User): Promise<User> {
    // if()
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async update(user: User): Promise<UpdateResult> {
    if (user.title) {
      const title = await this.titleService.findOneById(user.title.id);
      if (!title) throw new BizException('头衔设置错误，没有此头衔');
      user.title = title;
    }
    return this.userRepository.update(user.id, user);
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
  async register(u: UserAuthDTO, type: number) {
    const user = this.transformUserFromAuthDTO(u);
    const userRep = await this.findUserByUniqueParam(user);
    if (userRep) {
      throw new BadRequestException('用户已存在');
    }
    return this.userRepository.save(user);
  }

  /**
   * 登录用户
   * @param u
   * @param type
   * @returns
   */
  async login(u: UserAuthDTO, type: number): Promise<User> {
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
      return this.loginWithMOBILE(user, u);
    } else if (type === AUTH_TYPE.ACCOUNT) {
      /**
       * 账户密码登录
       */
      Assert.assertNotNil(user.password, '密码不能为空');
      const userRep = await this.findUserByUniqueParam(user);
      if (userRep) {
        /**
         * 登陆时用户存在，验证密码
         * 若密码不匹配则抛出异常
         * 若密码匹配则返回用户信息
         */
        const isPwdMatch = bcrypt.compareSync(user.password, userRep.password);
        if (isPwdMatch) return userRep;
        throw new BizException('账户或密码错误');
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
