import { Injectable } from '@nestjs/common';
import { Spot } from './entities/spot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { Repository } from 'typeorm';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { MD5 } from 'crypto-js';
import * as qs from 'querystring';
import { SpotMonth } from './entities/spot-month.entity';
import { SpotFeature } from './entities/spot-feature.entity';
import { Month } from './entities/month.entity';
import { Feature } from './entities/feature.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Spot)
    private spotRepository: Repository<Spot>,
    @InjectRepository(SpotMonth)
    private spotMonthRepository: Repository<SpotMonth>,
    @InjectRepository(SpotFeature)
    private spotFeatureRepository: Repository<SpotFeature>,
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
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getLocationInfo(location: string) {
    const secret = 'DT8T8NpypPGDqQBcSe8nSO53odc5zUtc' || process.env['secret'];
    const key = 'Q7QBZ-R5VED-3YE4D-HORZP-XHTXJ-4UBXX';
    const get_poi = 0;

    const sig = MD5(
      `/ws/geocoder/v1?get_poi=${get_poi}&key=${key}&location=${location}${secret}`,
    ).toString();
    console.log(sig, secret);

    console.log();

    const { data } = await axios<{ result: GeocodeResult }>({
      method: 'GET',
      url: `https://apis.map.qq.com/ws/geocoder/v1?${qs.encode({
        key,
        location,
        sig,
        get_poi,
      })}`,
    });

    // console.log(data.result);

    return data.result;
  }

  async createSpotsDB() {
    /**
     * 读取 Excel 文件
     */
    const workbook = xlsx.readFile(
      path.resolve(__dirname, '../static/A级景区.xlsx'),
    );

    /**
     * 获取第一个工作表
     */
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    /**
     * 将 Excel 表格转换成 JSON 数据，默认首行为key
     */
    const json = xlsx.utils.sheet_to_json<{
      name: string;
      area: string;
      level: string;
      lng: string;
      lat: string;
    }>(sheet);

    /**
     * 根据坐标获取县区、城市、省份、国家（中国）
     */
    const china = await this.countryRepository.findOneBy({ name: '中国' });

    console.log(json[0]);

    // let index = 7026;
    // let index = 7905;
    // let index = 8088;
    let index = 0;
    let errors = [] as number[];
    const timer = setInterval(async () => {
      console.log('当前已插入：', index);
      console.log('当前错误：', errors.join());

      if (index === json.length) {
        console.log('所有数据插入完成');
        clearInterval(timer);
        return;
      }

      const { lat, lng, name } = json[index++];

      /**
       * 地图信息
       */
      let res: GeocodeResult;
      try {
        res = await this.getLocationInfo(`${lat},${lng}`);
      } catch (error) {
        errors.push(index - 1);
        console.error(error, res);
        return;
      }
      /**
       * 地区可能不存在
       */
      if (!res) {
        errors.push(index - 1);
        return;
      }

      const {
        address,
        formatted_addresses: { recommend } = { recommend: '' },
        ad_info: { province, city, district },
      } = res;

      /**
       * 地区数据
       */
      const pqb = this.provinceRepository.createQueryBuilder('province');
      const pRep = await pqb
        .where(`'${province}' LIKE CONCAT(province.name, '%')`)
        .orWhere(`province.name LIKE '${province}%'`)
        .getOne();
      if (pRep) pRep.country = china;

      const cqb = this.cityRepository.createQueryBuilder('city');
      let cRep = await cqb
        .where(`'${city}' LIKE CONCAT(city.name, '%')`)
        .orWhere(`city.name LIKE '${city}%'`)
        .getOne();
      /**
       * 台湾省、澳门、香港的数据可能不存在
       * 直辖市的区数据作为city
       */
      if (cRep) cRep.province = pRep;
      else {
        cRep = await cqb
          .where(`'${district}' LIKE CONCAT(city.name, '%')`)
          .orWhere(`city.name LIKE '${district}%'`)
          .getOne();
      }

      const dqb = this.districtRepository.createQueryBuilder('district');
      const dRep = await dqb
        .where(`'${district}' LIKE CONCAT(district.name, '%')`)
        .orWhere(`district.name LIKE '${district}%'`)
        .getOne();
      /**
       * 直辖市可能不存在区县
       */
      if (dRep) dRep.city = cRep;

      const spot = new Spot();
      spot.name = name;
      spot.description = `${address} ${recommend}`;
      spot.country = china;
      spot.province = pRep;
      spot.city = cRep;
      spot.district = dRep;

      const sqb = this.spotRepository.createQueryBuilder('spot');
      const spotRep = await sqb.where('spot.name = :name', { name }).getOne();
      if (!spotRep) {
        await this.spotRepository.save(spot);
      } else {
        await this.spotRepository.update(spotRep.id, spot);
      }
    }, 300);
  }

  async createSpotMonthSpotFeatureDB() {
    /**
     * 从 spot 表中取出所有数据进行遍历 spot
     *
     * 从 month 表中随机取出几个数据 months
     *
     * 从 feature 表中随机取出几个数据 features
     *
     * 遍历 months 生成 spot-months 实体并保存到数据库
     *
     * 遍历 features 生成 spot-features 实体并保存到数据库
     *
     * 应该使用for await，不能使用for each，否则并发太大
     */

    const spots = await this.spotRepository.find();
    const allMonth = await this.monthRepository.find();
    const allFeature = await this.featureRepository.find();
    const mqb = this.monthRepository
      .createQueryBuilder('month')
      .orderBy('RAND()');
    const fqb = this.featureRepository
      .createQueryBuilder('feature')
      .orderBy('RAND()');

    let counter = 0;
    for (let index = 0; index < spots.length; index++) {
      console.log(
        '===========================================================',
      );
      console.log(
        '当前已完成景点个数：',
        index,
        '，景点总个数：',
        spots.length,
        '总插入条数：',
        counter,
      );
      console.log(
        '===========================================================',
      );
      const spot = spots[index];
      const months = await mqb
        .limit(Math.ceil(Math.random() * allMonth.length))
        .getMany();
      const features = await fqb
        .limit(Math.ceil(Math.random() * allFeature.length))
        .getMany();

      /**
       * forEach不会等待，可与features的遍历共同进行，并发不会太大
       */
      const sms = months.map((month) => {
        counter++;
        const sm = new SpotMonth();
        sm.month = month;
        sm.spot = spot;
        sm.weight = Math.floor(Math.random() * 100);
        return sm;
      });

      const sfs = features.map((feature) => {
        counter++;
        const sf = new SpotFeature();
        sf.feature = feature;
        sf.spot = spot;
        sf.weight = Math.floor(Math.random() * 100);
        return sf;
      });

      /**
       * feature一般少于month，可以选择不用await
       * 由于在插入时
       */
      this.spotFeatureRepository.save(sfs);
      this.spotMonthRepository.save(sms);
    }
  }
}
