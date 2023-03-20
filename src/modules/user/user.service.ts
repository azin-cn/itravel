import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Title } from 'src/entities/title.entity';
import { BizException } from 'src/shared/exceptions/BizException';

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
  ) {}

  async create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async update(user: Partial<User>): Promise<UpdateResult> {
    if (user.title) {
      const title = this.titleRepository.findOneBy({ id: user.title.id });
      if (!title) throw new BizException('头衔设置错误，没有此头衔！');
    }
    return this.userRepository.update(user.id, user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id, isDeleted: false });
  }
}
