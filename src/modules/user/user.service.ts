import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Title } from 'src/entities/title.entity';
import { BizException } from 'src/shared/exceptions/BizException';
import { TitleService } from '../title/title.service';

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

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { isDeleted: false },
    });
  }

  async findUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id, isDeleted: false });
  }

  /**
   *
   * @returns 所有用户，包括已删除
   */
  async findAllAdmin() {
    return this.userRepository.findAndCount();
  }

  /**
   *
   * @param id
   * @returns 寻找用户，包括已删除
   */
  async findUserByIdAdmin(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async create(user: User): Promise<User> {
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
}
