import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Month } from 'src/entities/month.entity';
import { Spot } from 'src/entities/spot.entity';
import { Assert } from 'src/utils/Assert';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
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
import { arrayNotEmpty, isNotEmpty } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SpotBriefVO, SpotCountVO, SpotFMVO } from './vo/spot.vo';

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
   * 获取 qb
   * @param id
   * @returns
   */
  getSpotQBById(id: string): { qb: SelectQueryBuilder<Spot> } {
    const qb = this.spotRepository
      .createQueryBuilder('spot')
      .where('spot.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('spot.id = :id', { id });
    return { qb };
  }

  /**
   * 查询指定景点信息
   * @param id
   * @returns
   */
  async findSpotById(id: string): Promise<Spot> {
    const qb = this.spotRepository
      .createQueryBuilder('spot')
      .where('spot.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('spot.id = :id', { id });
    const spot = await qb.getOne();
    Assert.isNotEmptySpot(spot);
    return spot;
  }

  /**
   * 查询指定景点信息
   * @param id
   * @returns
   */
  async findSpotByIdAdmin(id: string): Promise<Spot> {
    const spot = await this.spotRepository.findOneBy({ id });
    Assert.isNotEmptySpot(spot);
    return spot;
  }

  async findSpotBriefInfoWithRegionById(id: string): Promise<Spot> {
    const { qb } = this.getSpotQBById(id);
    /**
     * 将province和city取出作为tag标识
     */
    qb.andWhere('spot.id = :id', { id })
      .leftJoinAndSelect(
        'spot.province',
        'province',
        'province.id = spot.province_id',
      )
      .leftJoinAndSelect('spot.city', 'city', 'city.id = spot.city_id');
    const spot = await qb.getOne();
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
   * 插入前的关键操作
   * @param spotDTO
   * @returns
   */
  async relate(spotDTO: SpotDTO): Promise<Spot> {
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

    const { thumbUrl, panorama } = spotDTO;

    /**
     * (四) 处理数据
     */
    spot.district = districtRep;
    spot.city = cityRep;
    spot.province = provinceRep;
    spot.country = provinceRep.country;
    spot.spotMonths = spotMonths;
    spot.spotFeatures = spotFeatures;
    spot.thumbUrl = thumbUrl;
    spot.panorama = panorama;

    return spot;
  }

  /**
   * 创建景点，需要认证
   * @param spot
   * @returns
   */
  async create(spotDTO: SpotDTO): Promise<Spot> {
    Assert.assertNotNil(spotDTO.thumbUrl, '景点缩略图不存在');
    Assert.assertNotNil(spotDTO.panorama, '景点全景图不存在');

    const spot = await this.relate(spotDTO);
    console.log(spot);
    return this.spotRepository.save(spot);
  }

  /**
   * 更新景点
   * @param spotDTO
   * @returns
   */
  async update(spotDTO: SpotDTO): Promise<UpdateResult> {
    Assert.assertNotNil(spotDTO.id, '更新景点ID为空');
    const spot = await this.relate(spotDTO);
    return this.spotRepository.update(spot.id, spot);
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
    qb: SelectQueryBuilder<unknown>;
    area: string;
    itemArea: string;
  } {
    /**
     * 查询的主体是区域，必须区域 leftJoin 景点 或者 景点 rightJoin 区域才可以将所有区域返回
     */
    let qb: SelectQueryBuilder<unknown>;

    const { country, province, city } = spotDTO;
    let area: string, itemArea: string;

    if (city) {
      area = 'city';
      itemArea = 'district';
      qb = this.districtRepository.createQueryBuilder('district').where('1=1');
      qb.leftJoin(Spot, 'spot', 'spot.district_id = district.id')
        .leftJoin(City, 'city', `city.id = spot.city_id`)
        .where(`city.id = '${city}'`);
    } else if (province) {
      area = 'province';
      itemArea = 'city';
      qb = this.cityRepository.createQueryBuilder('city').where('1=1');
      qb.leftJoin(Spot, 'spot', 'spot.city_id = city.id')
        .leftJoin(Province, 'province', `province.id = spot.province_id`)
        .where(`province.id = '${province}'`);
    } else if (country) {
      area = 'country';
      itemArea = 'province';
      qb = this.provinceRepository.createQueryBuilder('province').where('1=1');
      qb.leftJoin(Spot, 'spot', 'spot.province_id = province.id')
        .leftJoin(Country, 'country', `country.id = spot.country_id`)
        .where(`country.id = '${country}'`);
    } else if (!(country || province || city)) {
      /**
       * 都不存在
       * 目前仅在中国
       */
      area = 'country';
      itemArea = 'province';
      qb = this.provinceRepository.createQueryBuilder('province').where('1=1');
      qb.leftJoin(Spot, 'spot', 'spot.province_id = province.id');
      qb.leftJoin(Country, 'country', 'country.id = spot.country_id');
      qb.andWhere('country.name = "中国"');
    }

    /**
     * 月份和特色，非空则加入条件
     */
    const { features, months } = spotDTO;
    if (isNotEmpty(features)) {
      qb.leftJoin('spot.spotFeatures', 'sf');
      qb.andWhere('sf.feature_id IN (:...features)', { features });
    }
    if (isNotEmpty(months) && months.length !== 12) {
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
      .addSelect(`'${itemArea}' AS level`);

    /**
     * 分组规则
     */
    qb.groupBy(`${itemArea}.id`);

    const counts = plainToInstance(SpotCountVO, await qb.getRawMany());
    // console.log(counts);
    return counts;
  }

  /**
   * 根据spotDTO决定是否Spot LEFT JOIN Month 并设置 WHERE 条件
   * @param qb
   * @param spotDTO
   * @returns
   */
  getQBWhichSpotLeftJoinMonthWithQB(
    qb: SelectQueryBuilder<Spot>,
    spotDTO: SpotDTO,
  ): { qb: SelectQueryBuilder<Spot> } {
    const { months } = spotDTO;
    if (isNotEmpty(months)) {
      /**
       * null
       * [] | [some]
       */
      qb.leftJoin('spot.spotMonths', 'sm');
      qb.andWhere('sm.month_id IN (:...months)', { months });
    }
    return { qb };
  }

  /**
   * 根据spotDTO决定是否Spot LEFT JOIN Feature 并设置 WHERE 条件
   * @param qb
   * @param spotDTO
   * @returns
   */
  getQBWhichSpotLeftJoinFeatureWithQB(
    qb: SelectQueryBuilder<Spot>,
    spotDTO: SpotDTO,
  ): { qb: SelectQueryBuilder<Spot> } {
    const { features } = spotDTO;
    if (isNotEmpty(features)) {
      /**
       * null
       * [] | [some]
       */
      qb.leftJoin('spot.spotFeatures', 'sf');
      qb.andWhere('sf.feature_id IN (:...features)', { features });
    }
    return { qb };
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
    qb: SelectQueryBuilder<Spot>;
    area: 'country' | 'province' | 'city';
    itemArea: 'country' | 'province' | 'city' | 'district';
  } {
    const qb = this.spotRepository.createQueryBuilder('spot').where('1=1');

    /**
     * 只能存在一种，country、province、city、district，使用if else结构
     * 为了兼容传递的数据，使用多个 if 而不是 if else
     * district是不存在的，因为最小只能到city，而city就是索引district的数据
     * 如果区域关系不正确，如广东梅州被改成山东梅州，则查不出数据
     */
    const { country, province, city } = spotDTO;
    let area: 'country' | 'province' | 'city',
      itemArea: 'country' | 'province' | 'city' | 'district';

    if (country) {
      area = 'country';
      itemArea = 'province';
      qb.leftJoin(Country, 'country', `country.id = spot.country_id`)
        .leftJoin(Province, 'province', 'province.id = spot.province_id')
        .andWhere(`country.id = '${country}'`);
    }
    if (province) {
      area = 'province';
      itemArea = 'city';
      qb.leftJoin(Province, 'province', `province.id = spot.province_id`)
        .leftJoin(City, 'city', 'city.id = spot.city_id')
        .andWhere(`province.id = '${province}'`);
    }
    if (city) {
      area = 'city';
      itemArea = 'district';
      qb.leftJoin(City, 'city', `city.id = spot.city_id`)
        .leftJoin(District, 'district', 'district.id = spot.district_id')
        .andWhere(`city.id = '${city}'`);
    }
    if (!(country || province || city)) {
      /**
       * 都不存在
       * 目前仅在中国
       */
      area = 'country';
      itemArea = 'province';
      qb.leftJoin(Country, 'country', 'country.id = spot.country_id');
      qb.leftJoin(Province, 'province', 'province.id = spot.province_id');
      qb.andWhere('country.name = "中国"');
    }

    /**
     * 月份和特色，非空则加入条件
     * @deprecated 已拆分
     * @new 请看 getQBWhichSpotLeftJoinMonthWithQB | getQBWhichSpotLeftJoinFeatureWithQB
     */
    const { features, months } = spotDTO;

    return { qb, area, itemArea };
  }

  /**
   * 获取区域的景点数量，返回具有景点的区域(具有景点的区域)
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
   * 使用Spot Left Join region
   * @param spotDTO
   */
  async findSpotsByConditions(
    spotDTO: SpotDTO,
    limit = 7,
  ): Promise<SpotBriefVO[]> {
    /**
     * 需要使用的是 spot left join other 形式
     */
    const { qb, area, itemArea } = this.getQBWhichSpotLeftJoinRegion(spotDTO);

    if (spotDTO.name) {
      qb.orWhere(
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
     * getQBWhichSpotLeftJoinFeatureWithQB 手动控制 join feature
     * getQBWhichSpotLeftJoinMonthWithQB 手动控制 join month
     * @description 在 getQBWhichSpotLeftJoinRegion 中已废弃组合 join feature 和 join month
     * 相关排序sql请看 ./sql
     */

    const { months, features } = spotDTO;

    qb.leftJoin(
      (sub: SelectQueryBuilder<SpotMonth>) => {
        sub
          .select('spot_id, sum(weight) as weight')
          .from(SpotMonth, 'spot_month')
          .where('1=1')
          .groupBy('spot_id');
        if (arrayNotEmpty(months)) {
          sub.andWhere('sm.month_id IN (:...months)', { months });
        }
        return sub;
      },
      'sm',
      'sm.spot_id = spot.id',
    );
    qb.leftJoin(
      (sub: SelectQueryBuilder<SpotFeature>) => {
        sub
          .select('spot_id, sum(weight) as weight')
          .from(SpotFeature, 'spot_feature')
          .where('1=1')
          .groupBy('spot_id');
        if (arrayNotEmpty(features)) {
          sub.andWhere('sf.feature_id IN (:...features)', { features });
        }
        return sub;
      },
      'sf',
      'sf.spot_id = spot.id',
    );

    qb.select('spot.id, spot.name, spot.description, spot.thumb_url thumbUrl')
      .addSelect(`(sm.weight + sf.weight + ${itemArea}.weight)`, 'weight')
      .addSelect(`${itemArea}.name`, 'region')
      .addSelect(`${itemArea}.id`, 'regionId')
      .addSelect(`'${itemArea}'`, 'level')
      .orderBy('weight', 'DESC')
      .addOrderBy('spot.name', 'ASC')
      .limit(limit);
    const spots = plainToInstance(SpotBriefVO, await qb.getRawMany());
    return spots;
  }

  /**
   * 获取随机推荐
   * @param spotDTO
   * @param limit
   * @returns
   */
  async findRandRecommentSpots(
    spotDTO: SpotDTO,
    limit = 8,
  ): Promise<SpotBriefVO[]> {
    const qb = this.spotRepository
      .createQueryBuilder('spot')
      .leftJoin(Province, 'province', 'province.id = spot.province_id')
      .select('spot.id, spot.name, spot.description, spot.thumb_url thumbUrl')
      .addSelect('province.name', 'region')
      .addSelect('province.id', 'regionId')
      .addSelect(`'province' as level`)
      .orderBy('RAND()')
      .limit(limit);
    const spots = plainToInstance(SpotBriefVO, await qb.getRawMany());
    return spots;
  }

  /**
   * 获取指定的 spot 的feature和month
   */
  async findSpotFeatureAndMonthById(id: string): Promise<SpotFMVO> {
    const { qb } = this.getSpotQBById(id);
    qb.leftJoin(SpotMonth, 'sm', 'sm.spot_id = spot.id')
      .leftJoin(SpotFeature, 'sf', 'sf.spot_id = spot.id')
      .leftJoin(Month, 'month', 'month.id = sm.month_id')
      .leftJoin(Feature, 'feature', 'feature.id = sf.feature_id');

    qb.select('spot.id, spot.name, spot.description, spot.thumb_url thumbUrl')
      .addSelect('spot.created_time', 'createdTime')
      .addSelect('spot.updated_time', 'updatedTime')
      .addSelect('month.id', 'months_id')
      .addSelect('month.name', 'months_name')
      .addSelect('feature.id', 'features_id')
      .addSelect('feature.name', 'features_name');

    const spot = SpotFMVO.mapResultSetToVO(await qb.getRawMany());

    return spot;
  }

  /**
   * 根据指定名称搜索
   * @param keywords
   * @param limit
   * @returns
   */
  async findSpotsByWords(keywords: string, limit = 10): Promise<Spot[]> {
    keywords = `%${keywords}%`;
    const qb = this.spotRepository.createQueryBuilder('spot').where('1=1');

    qb.select(['spot.id', 'spot.name'])
      .andWhere(
        'LOWER(spot.name) LIKE LOWER(:keywords) OR LOWER(spot.description) LIKE (:keywords)',
        { keywords },
      )
      .limit(limit);
    const spots = await qb.getMany();
    return spots;
  }

  /**
   * 通过spot ids获取spot options
   * @param ids
   */
  async findSpotsByIds(ids: string[]): Promise<Spot[]> {
    const qb = this.spotRepository
      .createQueryBuilder('spot')
      .where('1=1')
      .select(['spot.id', 'spot.name']);
    if (ids?.length) {
      qb.andWhere('spot.id IN (:...ids)', { ids });
    }

    const spots = await qb.getMany();
    return spots;
  }

  /**
   * 通过id获取景点全景图
   * @param id
   * @returns
   */
  async findSpotPanoramaById(id: string): Promise<Spot> {
    const spot = await this.spotRepository.findOneBy({ id, isDeleted: false });
    Assert.isNotEmptySpot(spot);
    return spot;
  }
}
