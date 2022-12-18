import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { UserCreateDTO, UserEditDTO } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    // 此语句只是适配Repository的返回存储库类型，并且加入到nest中，因而显得很多步骤
    // 其实流程很简单，Repository是typeorm提供的存储库类型，而nestjs需要动态的管理这一个存储库类型，
    // 所以nestjs在TypeOrm.forFeature中标识了需要存储这一类型，在InjectRepository中将这一类型依赖注入
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(user: UserCreateDTO): Promise<User> {
    return this.userRepository.save(user);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  update(id: string, user: UserEditDTO): Promise<UpdateResult> {
    return this.userRepository.update(id, user);
  }

  getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  getUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
}
