import { Module } from '@nestjs/common';
import { SpotController } from './spot.controller';
import { SpotService } from './spot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spot.entity';
import { Region } from 'src/entities/region.entity';
import { Province } from 'src/entities/province.entity';
import { City } from 'src/entities/city.entity';
import { District } from 'src/entities/district.entity';
import { Month } from 'src/entities/month.entity';
import { SpotMonth } from 'src/entities/spot-month.entity';
import { Country } from 'src/entities/country.entity';
import { Feature } from 'src/entities/feature.entity';
import { SpotFeature } from 'src/entities/spot-feature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Spot,
      Region,
      Country,
      Province,
      City,
      District,
      Month,
      SpotMonth,
      Feature,
      SpotFeature,
    ]),
  ],
  controllers: [SpotController],
  providers: [SpotService],
  exports: [
    SpotService,
    TypeOrmModule.forFeature([
      Spot,
      Region,
      Country,
      Province,
      City,
      District,
      Month,
      SpotMonth,
      Feature,
      SpotFeature,
    ]),
  ],
})
export class SpotModule {}
