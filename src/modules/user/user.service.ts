import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Title } from 'src/entities/title.entity';
import { BizException } from 'src/shared/exceptions/BizException';
import { TitleService } from '../title/title.service';
import { USER_STATUS } from 'src/shared/constants/user.constant';
import { Assert } from 'src/utils/Assert';

@Injectable()
export class UserService {
  constructor(
    /**
     * 此语句只是适配Repository的返回存储库类型，并且加入到nest中，因而显得很多步骤
     * 其实流程很简单，Repository是typeorm提供的存储库类型，而nestjs需要动态的管理这一个存储库类型，
     * 所以nestjs在TypeOrm.forFeature中标识了需要存储这一类型，在InjectRepository中将这一类型依赖注入
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Title)
    private titleRepository: Repository<Title>,
    @Inject(TitleService)
    private titleService: TitleService,
  ) {}

  /**
   *  *UserService 仅有管理员模式才可以同时查询未删除和已删除*
   */

  /**
   * 查找所有用户
   * isDeleted = false
   * status
   * @returns
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { isDeleted: false, status: USER_STATUS.ACTIVE },
    });
  }

  /**
   * 查找所有用户，管理员模式
   * @returns 所有用户，包括未激活、已删除
   */
  async findAllAdmin(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * 通过ID查找用户，只能查询未删除的用户
   * @param id
   * @returns
   */
  async findUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({
      id,
      isDeleted: false,
    });
  }

  /**
   * 通过ID查找用户，管理员模式
   * @param id
   * @returns 寻找用户，包括未激活、已删除
   */
  async findUserByIdAdmin(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * 通过ID查找未删除、未激活用户
   * 注册查询时使用，搭配 findUserById 在更新 User 时使用
   * @param id
   * @returns
   */
  async findNotActiveUserById(id: string) {
    return this.userRepository.findOneBy({
      id,
      status: USER_STATUS.NO_ACTIVE,
      isDeleted: false,
    });
  }

  /**
   * 查找所有未激活、未删除的用户
   * @returns
   */
  async findAllNotActiveUser() {
    return this.userRepository.find({
      where: { status: USER_STATUS.NO_ACTIVE, isDeleted: false },
    });
  }

  /**
   * 通过唯一条件查找用户
   * 唯一条件：用户名、手机、邮箱
   * @param _user
   */
  async findUserByUniqueParam(user: User): Promise<User> {
    return this.findUserByUniqueParamAdmin(user, USER_STATUS.ACTIVE, false);
  }

  /**
   * 通过唯一条件查找用户，管理员模式
   * @param _user
   * @param isDeleted
   * @returns 寻找用户，包括未激活、已删除
   */
  async findUserByUniqueParamAdmin(
    _user: User,
    status = USER_STATUS.NO_ACTIVE,
    isDeleted = true,
  ) {
    const { username, phone, email } = _user;
    const handle = this.userRepository.createQueryBuilder('user');
    // .select(['username', 'phone', 'email']);
    handle.where(
      '(user.username = :username OR user.phone = :phone OR user.email = :email)',
      { username, phone, email },
    );

    if (status === USER_STATUS.ACTIVE) {
      /**
       * status 仅在 查询活跃时起效，不代表 Admin 仅查询一种情况
       */
      handle.andWhere('user.status = :status', { status });
    }

    if (!isDeleted) {
      /**
       * isDeleted 只在 为false时起效，不代表不查询已删除
       */
      handle.andWhere('user.is_deleted = :isDeleted', { isDeleted });
    }
    return handle.getOne();
  }

  /**
   * 通过id验证用户是否存在，失败则抛出异常
   * @param id
   * @returns
   */
  async validateUserById(id: string): Promise<User> {
    const user = await this.findUserById(id);
    Assert.isNotEmptyUser(user);
    return user;
  }

  /**
   * 创建新用户
   * @param user
   * @returns
   */
  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  /**
   * 软删除用户
   * @param id
   * @returns
   */
  async delete(id: string): Promise<UpdateResult> {
    const user = await this.findUserById(id);
    Assert.isNotEmptyUser(user);
    return this.userRepository.update(id, { isDeleted: true });
  }

  /**
   * 硬删除用户，管理员模式
   * @param id
   * @returns
   */
  async deleteAdmin(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  /**
   *
   * @param user
   * @returns
   */
  async update(user: User): Promise<User> {
    if (user.title) {
      /**
       * 更新中有头衔更新
       */
      const title = await this.titleService.findOneById(user.title.id);
      if (!title) throw new BizException('头衔设置错误，没有此头衔');
      user.title = title;
    }

    /**
     * isDeleted 等高级权限不允许 update，在 Pipe 中已经去除
     */
    const { affected } = await this.userRepository.update(user.id, user);
    Assert.isNotZero(affected, '更新失败，无此用户');
    return this.findUserById(user.id);
  }

  async updateAdmin(user: User): Promise<User> {
    if (user.title) {
      /**
       * 更新中有头衔更新
       */
      const title = await this.titleService.findOneById(user.title.id);
      if (!title) throw new BadRequestException('头衔设置错误，没有此头衔');
      user.title = title;
    }

    /**
     * Admin 的权限可以更新所有的字段
     */
    const { affected } = await this.userRepository.update(user.id, user);
    Assert.isNotZero(affected, '更新失败，无此用户');
    return this.findUserById(user.id);
  }
}
