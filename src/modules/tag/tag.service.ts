import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async findAll() {
    return await this.tagRepository.findAndCount();
  }
}
