import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/entities/city.entity';
import { Country } from 'src/entities/country.entity';
import { District } from 'src/entities/district.entity';
import { Province } from 'src/entities/province.entity';
import { Assert } from 'src/utils/Assert';
import { Repository } from 'typeorm';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  /**
   * 通过id查找县区
   * @param id
   * @returns
   */
  async findDistrictById(id: string) {
    const district = await this.districtRepository.findOne({
      where: { id },
      relations: ['city'],
    });
    Assert.assertNotNil(district, '县区不存在');
    return district;
  }

  /**
   * 通过id查找城市
   * @param id
   * @returns
   */
  async findCityById(id: string) {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['province'],
    });
    Assert.assertNotNil(city, '城市不存在');
    return city;
  }
  /**
   * 通过id查找省
   * @param id
   * @returns
   */
  async findProvinceById(id: string) {
    const province = await this.provinceRepository.findOne({
      where: { id },
      relations: ['country'],
    });
    Assert.assertNotNil(province, '省区不存在');
    return province;
  }
  /**
   * 通过id查找国
   * @param id
   * @returns
   */
  async findCountryById(id: string) {
    const country = await this.countryRepository.findOne({
      where: { id },
    });
    Assert.assertNotNil(country, '国区不存在');
    return country;
  }
}
