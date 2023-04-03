import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feature } from 'src/entities/feature.entity';
import { Assert } from 'src/utils/Assert';
import { Repository } from 'typeorm';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
  ) {}

  /**
   * 通过id查找特色
   * @param id
   * @returns
   */
  async findFeatureById(id: string): Promise<Feature> {
    return this.featureRepository.findOneBy({ id });
  }

  /**
   * 通过ids查找特色数组
   * @param ids
   * @returns
   */
  async findFeaturesByIds(ids: string[]): Promise<Feature[]> {
    const qb = this.featureRepository.createQueryBuilder('feature');
    const features = await qb
      .where('feature.id IN (:...ids)', { ids })
      .getMany();
    Assert.isNotEmptyObject(features);
    return features;
  }
}
