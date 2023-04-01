import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Month } from 'src/entities/month.entity';
import { Spot } from 'src/entities/spot.entity';
import { Assert } from 'src/utils/Assert';
import { Repository } from 'typeorm';
import { SpotDTO } from './dto/spot.dto';
import { SpotFeature } from 'src/entities/spot-feature.entity';

@Injectable()
export class SpotService {
  constructor(
    @InjectRepository(Spot)
    private spotRepository: Repository<Spot>,
    @InjectRepository(Month)
    private monthRepository: Repository<Month>,
  ) {}

  /**
   * 查询指定景点信息
   * @param id
   * @returns
   */
  async findSpotById(id: string): Promise<Spot> {
    const qb = this.spotRepository.createQueryBuilder('spot');

    qb.where('spot.id = :id', { id });

    // const spot = await this.spotRepository.findOneBy({ id });
    const spot = await qb.getOneOrFail();

    console.log(spot);
    Assert.isNotEmptySpot(spot);
    return spot;
  }

  /**
   * 转换spot
   * @param spotDTO
   * @returns
   */
  transformSpotFromSpotDTO(spotDTO: SpotDTO): Spot {
    const { name, description } = spotDTO;

    const spot = new Spot();
    spot.name = name;
    spot.description = description;

    return spot;
  }

  /**
   * 创建景点，需要认证
   * @param spot
   * @returns
   */
  async create(spotDTO: SpotDTO): Promise<Spot> {
    const { months, features, country, province, city, district } = spotDTO;
    /**
     * months、features必须存在
     */
    Assert.isNotEmptyObject(months);
    Assert.isNotEmptyObject(features);

    /**
     * 区域必须存在
     */
    Assert.assertNotNil(country, 'country 为空');
    Assert.assertNotNil(province, 'province 为空');

    const spot = this.transformSpotFromSpotDTO(spotDTO);
    /**
     * 必须存在name和description
     */
    Assert.assertNotNil(spot.name);
    Assert.assertNotNil(spot.description);

    const spotFeatures = new SpotFeature();

    return this.spotRepository.save(spot);
  }

  async createMonth(m: Month) {
    return this.monthRepository.save(m);
  }
}
