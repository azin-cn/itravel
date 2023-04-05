import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Month } from 'src/entities/month.entity';
import { Spot } from 'src/entities/spot.entity';
import { Assert } from 'src/utils/Assert';
import { Repository, SelectQueryBuilder, getConnection } from 'typeorm';
import { SpotDTO } from './dto/spot.dto';
import { SpotFeature } from 'src/entities/spot-feature.entity';
import { SpotMonth } from 'src/entities/spot-month.entity';
import { MonthsService } from '../month/months.service';
import { FeaturesService } from '../feature/features.service';
import { Feature } from 'src/entities/feature.entity';
import { RegionService } from '../region/region.service';
import { Country } from 'src/entities/country.entity';
import { Province } from 'src/entities/province.entity';
import { City } from 'src/entities/city.entity';
import { District } from 'src/entities/district.entity';
import { arrayNotEmpty, isNotEmptyObject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SpotCountVO } from './vo/spot.vo';

@Injectable()
export class SpotService {
  constructor(
    @InjectRepository(Spot)
    private spotRepository: Repository<Spot>,
    @InjectRepository(Month)
    private monthRepository: Repository<Month>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
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

  /**
   * 获取根据条件构造的查询器
   * region left join spot
   * 无论region是否有景点都会返回区域
   * region: country | province | city
   * @param spotDTO
   * @returns
   */
  getQBWhichRegionLeftJoinSpot(spotDTO: SpotDTO): {
    qb: SelectQueryBuilder<any>;
    area: string;
    itemArea: string;
  } {
    /**
     * 查询的主体是区域，必须区域 leftJoin 景点 或者 景点 rightJoin 区域才可以将所有区域返回
     */
    let qb: SelectQueryBuilder<any>;

    const { country, province, city } = spotDTO;
    let area: string, itemArea: string;

    if (city) {
      area = 'city';
      itemArea = 'district';
      qb = this.districtRepository.createQueryBuilder('district').where('1=1');
      qb.leftJoin(City, 'city', `city.id = '${city}'`);
      qb.leftJoin(Spot, 'spot', 'spot.district_id = district.id');
    } else if (province) {
      area = 'province';
      itemArea = 'city';
      qb = this.cityRepository.createQueryBuilder('city');
      qb.leftJoin(Province, 'province', `province.id = '${province}'`);
      qb.leftJoin(Spot, 'spot', 'spot.city_id = city.id');
    } else if (country) {
      area = 'country';
      itemArea = 'province';
      qb = this.provinceRepository.createQueryBuilder('province');
      qb.leftJoin(Country, 'country', `country.id = '${country}'`);
      qb.leftJoin(Spot, 'spot', 'spot.province_id = province.id');
    } else if (!(country || province || city)) {
      /**
       * 都不存在
       * 目前仅在中国
       */
      area = 'country';
      itemArea = 'province';
      qb = this.provinceRepository.createQueryBuilder('province');
      qb.leftJoin(Country, 'country', 'country.name = "中国"');
      qb.leftJoin(Spot, 'spot', 'spot.province_id = province.id');
    }

    /**
     * 月份和特色，非空则加入条件
     */
    const { features, months } = spotDTO;
    if (arrayNotEmpty(features)) {
      qb.leftJoin('spot.spotFeatures', 'sf');
      qb.andWhere('sf.feature_id IN (:...features)', { features });
    }
    if (arrayNotEmpty(months)) {
      qb.leftJoin('spot.spotMonths', 'sm');
      qb.andWhere('sm.month_id IN (:...months)', { months });
    }

    return { qb, area, itemArea };
  }

  /**
   * 获取给定的区域内的景点数量（返回所有区域即使景点数量为0）
   * region left join spot
   * @param spotDTO
   * @returns
   */
  async findAreaSpotCountsByConditions(spotDTO: SpotDTO) {
    const { qb, area, itemArea } = this.getQBWhichRegionLeftJoinSpot(spotDTO);
    /**
     * 选取数据
     * 增加level
     * 增加或不增加 DISTINCT
     */
    qb.select(`${itemArea}.id`, 'id')
      .addSelect(`${itemArea}.name`, 'name')
      .addSelect(`${itemArea}.full_name`, 'fullName')
      .addSelect(`COALESCE( COUNT( DISTINCT spot.id), 0 )`, 'value')
      .addSelect(`'${itemArea}' AS level`)
      .andWhere(`${itemArea}.${area}_id = ${area}.id`);

    /**
     * 分组规则
     */
    qb.groupBy(`${itemArea}.id`);

    const counts = plainToInstance(SpotCountVO, await qb.getRawMany());
    // console.log(counts);
    return counts;
  }

  /**
   * 获取根据条件构造的查询器
   * spot left join region
   * 返回 spot 具有的信息，spot为主表
   * region: country | province | city
   * @param spotDTO
   * @returns
   */
  getQBWhichSpotLeftJoinRegion(spotDTO: SpotDTO): {
    qb: SelectQueryBuilder<any>;
    area: string;
    itemArea: string;
  } {
    const qb = this.spotRepository.createQueryBuilder('spot').where('1=1');
    /**
     * 月份和特色，非空则加入条件
     */
    const { features, months } = spotDTO;
    if (arrayNotEmpty(features)) {
      qb.leftJoin('spot.spotFeatures', 'sf');
      qb.andWhere('sf.feature_id IN (:...features)', { features });
    }
    if (arrayNotEmpty(months)) {
      qb.leftJoin('spot.spotMonths', 'sm');
      qb.andWhere('sm.month_id IN (:...months)', { months });
    }

    /**
     * 只能存在一种，country、province、city、district，使用if else结构
     * 为了兼容传递的数据，使用多个 if 而不是 if else
     * district是不存在的，因为最小只能到city，而city就是索引district的数据
     * 如果区域关系不正确，如广东梅州被改成山东梅州，则查不出数据
     */
    const { country, province, city } = spotDTO;
    let area: string, itemArea: string;

    if (country) {
      area = 'country';
      itemArea = 'province';
      qb.leftJoin(Country, 'country', `country.id = '${country}'`);
      qb.leftJoin(Province, 'province', 'province.id = spot.province_id');
    }
    if (province) {
      area = 'province';
      itemArea = 'city';
      qb.leftJoin(Province, 'province', `province.id = '${province}'`);
      qb.leftJoin(City, 'city', 'city.id = spot.city_id');
    }
    if (city) {
      area = 'city';
      itemArea = 'district';
      qb.leftJoin(City, 'city', `city.id = '${city}'`);
      qb.leftJoin(District, 'district', 'district.id = spot.district_id');
    }
    if (!(country || province || city)) {
      /**
       * 都不存在
       * 目前仅在中国
       */
      area = 'country';
      itemArea = 'province';
      qb.leftJoin(Country, 'country', 'country.name = "中国"');
      qb.leftJoin(Province, 'province', 'province.id = spot.province_id');
    }

    return { qb, area, itemArea };
  }

  /**
   * 获取区域的景点数量，返回具有景点的区域(具有景点)
   * spot left join region
   * @param spotDTO
   */
  async findSpotCountsByConditions(spotDTO: SpotDTO): Promise<SpotCountVO[]> {
    const { qb, area, itemArea } = this.getQBWhichSpotLeftJoinRegion(spotDTO);

    /**
     * 选取数据
     * 增加level
     */
    qb.select(`${itemArea}.id`, 'id')
      .addSelect(`${itemArea}.name`, 'name')
      .addSelect(`${itemArea}.full_name`, 'fullName')
      .addSelect(`COALESCE( COUNT( DISTINCT spot.id), 0 )`, 'value')
      .addSelect(`'${itemArea}' AS level`)
      .andWhere(`spot.${area}_id = ${area}.id`);

    /**
     * 分组规则
     */
    qb.groupBy(`${itemArea}.id`);

    const counts = plainToInstance(SpotCountVO, await qb.getRawMany());
    // console.log(counts);
    return counts;
  }

  /**
   * 根据条件获取景点实体数组
   * @param spotDTO
   */
  async findSpotsByConditions(spotDTO: SpotDTO): Promise<Spot[]> {
    /**
     * 需要使用的是 spot left join other 形式
     */
    const { qb, area, itemArea } = this.getQBWhichSpotLeftJoinRegion(spotDTO);

    if (spotDTO.name) {
      qb.andWhere(
        `LOWER( '${spotDTO.name}' ) LIKE LOWER( CONCAT(spot.name, '%') )`,
      )
        .orWhere(`LOWER( spot.name ) LIKE LOWER( :name )`, {
          name: spotDTO.name,
        })
        .orWhere(`LOWER( spot.description ) LIKE LOWER( :name ) `, {
          name: spotDTO.name,
        });
    }

    /**
     * 判断 months 和 features 决定是否join表
     * 在 getQBWhichSpotLeftJoinRegion 中只有 months 和 features 不为空才会 join
     */
    const { months, features } = spotDTO;
    if (!arrayNotEmpty(months)) {
      /**
       * 为空 join 表
       */
      qb.leftJoin('spot.spotMonths', 'sm');
    }
    if (!arrayNotEmpty(features)) {
      /**
       * 为空 join 表
       */
      qb.leftJoin('spot.spotFeatures', 'sf');
    }

    qb.select(`DISTINCT spot.id, spot.name, sf.weight`)
      .orderBy('sf.weight', 'DESC')
      .limit(10);

    const spots = await qb.getMany();
    const spotsRaw = await qb.getRawMany();
    console.log(spots[0]);
    console.log(spotsRaw[0]);
    return spots;
  }
}
