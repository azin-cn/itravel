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
import { Article } from './entities/article.entity';

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
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
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

  /**
   * 创建景区缩略图url
   */
  async createSpotThumbUrl() {
    const spots = await this.spotRepository.find();
    let counter = 1;

    const map = new Map<number, number>();

    const images = [
      'https://tse2-mm.cn.bing.net/th/id/OIP-C.g9UbVfyVZX-SfD09JcYr5QHaEK?pid=ImgDet&rs=1',
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.Lf2u2dPln44gRiIC7IR3IwHaEK?pid=ImgDet&rs=1',
      'https://desk-fd.zol-img.com.cn/t_s960x600c5/g4/M07/06/05/Cg-4y1TcgwGIcCW6ADOtF-oxuF8AAUn6wNDA_AAM60v722.jpg',
      'https://pic3.zhimg.com/v2-c6ae9c3aff36b9b221258f6a90577902_r.jpg',
      'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/02/03/ChMkJlbKxo2IT63KACN7OztCegEAALHmwPZIQ0AI3tT786.jpg',
      'https://b.zol-img.com.cn/desk/bizhi/image/10/960x600/1598319721647.jpg',
      'https://ts1.cn.mm.bing.net/th/id/R-C.b2ce2003596cd13b705d25facdd27860?rik=d4ivBEt4skiIwQ&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50064%2f4314.jpg_wh1200.jpg&ehk=ssMlV0RHlr3d5NxUoG%2faQrugcy2NB8BruRphOFxx1vI%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.db3836610f631c4d06bdde4fd923e98f?rik=qaf5de1wCMNaRw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50093%2f5337.jpg_wh1200.jpg&ehk=Oe3ZIbrBYnhQ0zqIu%2ftsRSE8srtaRlewEtSIg3sp6Zw%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.efeea7fe9c2700fcff22483246e448db?rik=2GOGPn7eZvqd7A&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0830%2fxiaguang4.jpg&ehk=WiVr1cmj4u7RnOhKcAbAFDCbcnEuMDMJc1g9GVQAoj8%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.8e283246276fad2c01e8d0e300bb4540?rik=umflFIIvM%2f%2b%2b6Q&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50118%2f7084.jpg_wh1200.jpg&ehk=1HQoa7wYy9xnf0HqsFbQQJAv79HJnBest1U0atuLHSQ%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.7b0791da556ca3d24acbf90ee49b739f?rik=8y%2bmKNLwPGRBNg&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50118%2f7101.jpg_wh1200.jpg&ehk=ioYQckbfqLEXxXpsxW0IgyNGeJCih5QezMPdD%2bTSuA0%3d&risl=&pid=ImgRaw&r=0',
      'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/0F/ChMkJlbKwtmINC3iAAx4ozyK5jAAALGuAMGw3cADHi7853.jpg',
      'https://pic4.zhimg.com/v2-14098590ffdbf8a4a3e0db52c07fdded_r.jpg?source=1940ef5c',
      'https://ts1.cn.mm.bing.net/th/id/R-C.f36fcbbb1a25d08c0a3455cb04e2d580?rik=AaK7Szk%2fpr6Dyw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50042%2f1772.jpg_wh1200.jpg&ehk=U7FSjN9jI1WWrYO6kH1UzxkYBq523Vr21iewotHYeA8%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.d9749f5121aceb9d69d23c052ecd84ec?rik=mtBrkeKAQt2kXg&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50042%2f7570.jpg_wh1200.jpg&ehk=HIISw7GgScoyjvmjz2hQpqmaIOw%2f6nP1DyyOXvwkRxU%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.4a5d022904290715a83ae6f6f1cd8dfb?rik=pKjzXCr%2beOTEyA&riu=http%3a%2f%2fimg.sytuku.com%2fuptu%2fyulantu%2f161010%2f5-161010223037.jpg&ehk=ABsgOnly7GEbTEeIuQ0FTcofoDLAFAP1m6s8s8M6asg%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.a527b360fe317d1ed2d80a49d51c9c1c?rik=SQr3Q9XFQzrf0A&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50075%2f6521.jpg_wh1200.jpg&ehk=7cbm1dF83MThf5g4EdvNfSIBgLkHs0931e6bQnc7sug%3d&risl=&pid=ImgRaw&r=0',
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.xc5KsKdO2u9T5hBCpE0yCgHaEK?pid=ImgDet&rs=1',
      'https://ts1.cn.mm.bing.net/th/id/R-C.47b9aad56cbd44ee526416808640b9fc?rik=B%2fkv4B4rQKGHUQ&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0830%2fxiaguang6.jpg&ehk=ZeFlshNb9tNEVE45IHxmdqogQUFsrh3Pb%2fTQ86sQ%2fpY%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.3f68d60fb0786df8223ff43c2725587a?rik=qP6pTO5lKqIlXg&riu=http%3a%2f%2fsc.68design.net%2fphotofiles%2f201505%2ffUfyxPPvS7.jpg&ehk=WeDZPcsMQRx7pnNTsV8EjsiEHsueGV9GTaddKxTj1r0%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.dab73e4d50895d260105e0e25d41371d?rik=qZ0RXkzD3NbRfw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50000%2f2401.jpg_wh1200.jpg&ehk=9q%2bizqiNF4NjPJ4yvA4iHnf7BVuwMJMhjOJOduWyoYM%3d&risl=&pid=ImgRaw&r=0',
      'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/0F/ChMkJlbKwnWIbdBEAAyF94ZEywYAALGoQMDOIkADIYP587.jpg',
      'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/02/03/ChMkJlbKxtqICzWtABTs9EQHkIUAALHrQLAW5UAFO0M151.jpg',
      'https://ts1.cn.mm.bing.net/th/id/R-C.06a21f77a7928a13f30885bbbe527c3f?rik=yC5KttaeGjlrfg&riu=http%3a%2f%2fimg.mm4000.com%2ffile%2fe%2f72%2f10064b055b.jpg%3fdown&ehk=JuUbMZ%2bS3C3m5FXazWYNez9dmpwVrqKho3rAXY%2baubY%3d&risl=&pid=ImgRaw&r=0',
      'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/02/01/ChMkJlbKxEeIUFCUAAn_0fHGz3sAALHEQCrAGkACf_p422.jpg',
      'https://ts1.cn.mm.bing.net/th/id/R-C.910786522c0cd45063bc8fc0f0aef0d0?rik=GZKkAKUGSryRsQ&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0922%2fshu12.jpg&ehk=GweT148sJrgm60TrXUlumNsgZHPa1M3FKjuvGGPIuvM%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.52e5622d2443fa71cfdcb9bb6087911d?rik=PCz7sh2I3PKBGA&riu=http%3a%2f%2fimage.qianye88.com%2fpic%2f0e0289806288b7faabbc147abba9f0a8&ehk=09cAU0nEZS2AWz6G3CDfmCPcuCPNiQ0NAfNFysgn248%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.68978afc71576a94a1d50ef5016dbd9e?rik=cDDsy5SLmDvDHQ&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50075%2f0779.jpg_wh1200.jpg&ehk=FG4Hd5S711LYcuLBIcDagQyk4KhcH1oIfqyk1MWUOyg%3d&risl=&pid=ImgRaw&r=0',
      'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/0E/ChMkJ1bKwhGIJFUZAAVHFzXgsW8AALGiQGvaxcABUcv637.jpg',
      'https://www.haoy99.com/FileUpload/2019-02/Shui1Zhu11i1Pao1pptB-173234_109.jpg',
      'https://ts1.cn.mm.bing.net/th/id/R-C.aa0c40317812024f29929629c944e403?rik=AvTKZQW8fWMELg&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50095%2f2641.jpg_wh1200.jpg&ehk=ryd8RMPeag3orATYY%2bg236F3Keidn%2fWY5LRoiUwoP94%3d&risl=&pid=ImgRaw&r=0',
      'https://ts1.cn.mm.bing.net/th/id/R-C.432357432ebe5fdfb777b78c7d121f30?rik=YR2o31HKGFDpOA&riu=http%3a%2f%2fpic.bizhi360.com%2fbbpic%2f95%2f4395.jpg&ehk=GcXmvzMg8NJzhm7u6paDc7FGwq3H2av%2b1f29kSIP3bU%3d&risl=&pid=ImgRaw&r=0',
    ];
    spots.forEach(async (spot) => {
      const index = Math.floor(Math.random() * images.length);
      const thumbUrl = images[index];

      await this.spotRepository.update(spot.id, { thumbUrl });
      console.log(
        '图像索引：',
        index,
        '当前计数：',
        counter++,
        '总数：',
        spots.length,
      );

      map.set(index, (map.get(index) || 0) + 1);
      const r: number[] = [];
      for (const [i, v] of map) {
        r[i] = v;
      }
      console.log(r.join());
    });
  }

  /**
   * 加长景区的简介
   */
  async updateSpotDescription() {
    const spots = await this.spotRepository.find();
    let counter = 1;
    spots.forEach(async (spot) => {
      let description = spot.description;
      if (description.length < 120) {
        description = description + '。' + description;
      }
      await this.spotRepository.update(spot.id, { description });
      console.log('当前计数：', counter++, '总计数：', spots.length);
    });
  }

  async replaceLocalhostToOnlineDomain(online = 'https://itravel.todayto.com') {
    /**
     * localhost
     * localhost:7000
     * http://localhost
     * http://localhost:7000
     * https://localhost
     * https://localhost:7000
     */
    // const localhost = /(https?:\/\/)?localhost(:\d+)?/g;
    this.replaceOrigin();
  }
  async replaceApiPrefix() {
    const origin = /https:\/\/itravel\.todayto\.com/;
    const prefix = 'https://itravel.todayto.com/api/v1';
    this.replaceOrigin(origin, prefix);
  }
  async replaceOrigin(
    localhost = /(https?:\/\/)?localhost(:\d+)?/g,
    online = 'https://itravel.todayto.com',
  ) {
    const articles = await this.articleRepository.find();
    let counter1 = 0;
    articles.forEach((article) => {
      // article.
      const images = article.images?.map((item) => {
        return item.replace(localhost, online);
      });
      const thumbUrl = article.thumbUrl?.replace(localhost, online);
      console.log(counter1++, article.id);
      this.articleRepository.update(article.id, { images, thumbUrl });
    });

    let counter2 = 0;
    const spots = await this.spotRepository.find();
    spots.forEach((spot) => {
      const thumbUrl = spot.thumbUrl?.replace(localhost, online);
      console.log(counter2++, spot.id);
      this.spotRepository.update(spot.id, { thumbUrl });
    });
  }

  async updateSpotPanorama(
    panorama = 'https://img.zcool.cn/community/019d425a5c4793a8012113c7dac382.jpg@1280w_1l_2o_100sh.jpg',
  ) {
    const spots = await this.spotRepository.find();
    spots.forEach((item) => {
      this.spotRepository.update(item.id, { panorama });
    });
  }
}
