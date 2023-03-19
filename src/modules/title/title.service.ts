import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Title } from 'src/entities/title.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(Title)
    private titleRepository: Repository<Title>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.titleRepository.findAndCount();
  }
}
