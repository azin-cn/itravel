import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from 'src/entities/district.entity';
import { City } from 'src/entities/city.entity';
import { Province } from 'src/entities/province.entity';
import { Country } from 'src/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([District, City, Province, Country])],
  providers: [RegionService],
  exports: [
    RegionService,
    TypeOrmModule.forFeature([District, City, Province, Country]),
  ],
})
export class RegionModule {}
