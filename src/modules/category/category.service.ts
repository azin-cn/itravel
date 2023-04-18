import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * 通过ids获取分类数组
   * @param ids
   * @returns
   */
  async findCategoriesByIds(ids: string[]): Promise<Category[]> {
    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .where('1=1')
      .andWhere('category.id IN (:...ids)', { ids })
      .select(['category.id', 'category.name']);
    const categories = await qb.getMany();
    return categories;
  }

  /**
   * 根据用户id获取创建的分类
   * @param userId
   * @param limit
   * @returns
   */
  async findCategoriesByWordsAndUserId(
    keywords: string,
    userId: string,
    limit = 10,
  ): Promise<Category[]> {
    keywords = `%${keywords}%`;
    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .where('1=1');

    qb.leftJoin('category.user', 'user')
      .select(['category.id', 'category.name', 'user.id', 'user.username'])
      .andWhere('user.id = :userId', { userId })
      .andWhere('LOWER(category.name) LIKE LOWER(:keywords)', { keywords })
      .limit(limit);

    const categories = await qb.getMany();

    return categories;
  }
}
