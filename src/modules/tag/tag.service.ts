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
  ) {}

  async findAll() {
    return await this.tagRepository.findAndCount();
  }

  async findTagsByWordsAndUserId(
    keywords: string,
    userId: string,
    limit = 10,
  ): Promise<Tag[]> {
    keywords = `%${keywords}%`;
    const qb = this.tagRepository.createQueryBuilder('tag').where('1=1');

    qb.leftJoin('tag.user', 'user')
      .select(['tag.id', 'tag.name', 'user.id', 'user.username'])
      .andWhere('user.id = :userId', { userId })
      .andWhere('LOWER(tag.name) LIKE LOWER(:keywords)', { keywords })
      .limit(limit);
    const tags = await qb.getMany();
    return tags;
  }

  /**
   * 通过ids获取分类数组
   * @param ids
   * @returns
   */
  async findTagsByIds(ids: string[]): Promise<Tag[]> {
    const qb = this.tagRepository
      .createQueryBuilder('tag')
      .where('1=1')
      .select(['tag.id', 'tag.name']);
    if (ids?.length) {
      qb.andWhere('tag.id IN (:...ids)', { ids });
    }

    const tags = await qb.getMany();
    return tags;
  }
}
