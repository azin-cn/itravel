import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Month } from 'src/entities/month.entity';
import { Assert } from 'src/utils/Assert';
import { Repository } from 'typeorm';

@Injectable()
export class MonthsService {
  constructor(
    @InjectRepository(Month)
    private monthRepository: Repository<Month>,
  ) {}

  /**
   * 通过id查找月份
   * @param id
   * @returns
   */
  async findMonthById(id: string): Promise<Month> {
    return this.monthRepository.findOneBy({ id });
  }

  /**
   * 通过ids查找月份数组
   * @param ids
   * @returns
   */
  async findMonthsByIds(ids: string[]): Promise<Month[]> {
    const qb = this.monthRepository.createQueryBuilder('month');
    const months = await qb.where('month.id IN (:...ids)', { ids }).getMany();
    Assert.isNotEmptyObject(months);
    return months;
  }

  /**
   * 获取所有的月份
   * @returns
   */
  async findAll(): Promise<Month[]> {
    return this.monthRepository.find();
  }

  /**
   * 获取所有的月份id
   * @returns
   */
  async findAllIds(): Promise<string[]> {
    const months = await this.monthRepository.find();
    return months.map((item) => item.id);
  }
}
