import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Month } from 'src/entities/month.entity';
import { Spot } from 'src/entities/spot.entity';
import { Assert } from 'src/utils/Assert';
import { Repository } from 'typeorm';

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
    const spot = await this.spotRepository.findOneBy({ id });
    console.log(spot);
    Assert.isNotEmptySpot(spot);
    return spot;
  }

  /**
   * 创建景点，需要认证
   * @param spot
   * @returns
   */
  async create(spot: Spot): Promise<Spot> {
    return this.spotRepository.save(spot);
  }
}
