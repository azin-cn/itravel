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
  ) {}

  async findOneById(id: string) {
    return this.titleRepository.findOneBy({ id, isDeleted: false });
  }
  async findOneByIdAdmin(id: string) {
    return this.titleRepository.findOneBy({ id });
  }
  async findAll() {
    return this.titleRepository.find({ where: { isDeleted: false } });
  }
  async findAllAdmin() {
    return this.titleRepository.find();
  }
  async udpate(title: Title) {
    return this.titleRepository.update(title.id, title);
  }
  async delete(id: string) {
    return this.titleRepository.delete(id);
  }
}
