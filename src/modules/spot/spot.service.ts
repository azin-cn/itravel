import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Month } from 'src/entities/month.entity';
import { Spot } from 'src/entities/spot.entity';
import { Assert } from 'src/utils/Assert';
import { Repository } from 'typeorm';
import { SpotDTO } from './dto/spot.dto';
import { SpotFeature } from 'src/entities/spot-feature.entity';
import { SpotMonth } from 'src/entities/spot-month.entity';
import { MonthsService } from '../month/months.service';
import { FeaturesService } from '../feature/features.service';
import { Feature } from 'src/entities/feature.entity';
import { RegionService } from '../region/region.service';

@Injectable()
export class SpotService {
  constructor(
    @InjectRepository(Spot)
    private spotRepository: Repository<Spot>,
    @InjectRepository(Month)
    private monthRepository: Repository<Month>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    private regionService: RegionService,
    private monthService: MonthsService,
    private featureService: FeaturesService,
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
    const { months, features, district } = spotDTO;

    /**
     * (一) 必须存在name和description
     */
    const spot = this.transformSpotFromSpotDTO(spotDTO);
    Assert.assertNotNil(spot.name);
    Assert.assertNotNil(spot.description);

    /**
     * (二) 区域必须存在
     * 通过district查找city，通过city查找province，通过province查找country
     */
    Assert.assertNotNil(district);
    const districtRep = await this.regionService.findDistrictById(district);
    Assert.assertNotNil(districtRep);

    const cityRep = await this.regionService.findCityById(districtRep.city.id);
    Assert.assertNotNil(cityRep);

    const provinceRep = await this.regionService.findProvinceById(
      cityRep.province.id,
    );
    Assert.assertNotNil(provinceRep);

    /**
     * (三) 数据库中 months、features 必须存在
     * month、feature 是数据库中默认存储的
     */
    const monthReps = await this.monthService.findMonthsByIds(months);
    const featureReps = await this.featureService.findFeaturesByIds(features);
    Assert.isNotEmptyObject(monthReps);
    Assert.isNotEmptyObject(featureReps);

    const spotMonths = monthReps.map((monthRep) => {
      const sm = new SpotMonth();
      sm.month = monthRep;
      sm.spot = spot;
      return sm;
    });

    const spotFeatures = featureReps.map((featureRep) => {
      const sf = new SpotFeature();
      sf.feature = featureRep;
      sf.spot = spot;
      return sf;
    });

    /**
     * (四) 处理数据
     */
    spot.district = districtRep;
    spot.city = cityRep;
    spot.province = provinceRep;
    spot.country = provinceRep.country;
    spot.spotMonths = spotMonths;
    spot.spotFeatures = spotFeatures;

    return this.spotRepository.save(spot);
  }

  async findSpotsByConditions() {
    // select * from spot wher .....
    // spot
    const qb = this.featureRepository.createQueryBuilder('feature');
    qb.getOne(); // 
    
    qb.getRawOne(); // 
  }
}
