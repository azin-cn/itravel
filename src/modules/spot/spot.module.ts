import { Module } from '@nestjs/common';
import { SpotController } from './spot.controller';
import { SpotService } from './spot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spot.entity';
import { Province } from 'src/entities/province.entity';
import { City } from 'src/entities/city.entity';
import { District } from 'src/entities/district.entity';
import { Country } from 'src/entities/country.entity';
import { SpotCoordinate } from 'src/entities/spot-coordinate.entity';
import { FeaturesModule } from '../feature/features.module';
import { MonthsModule } from '../month/months.module';
import { SpotMonthModule } from '../spot-month/spot-month.module';
import { SpotFeatureModule } from '../spot-feature/spot-feature.module';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Spot,
      Country,
      Province,
      City,
      District,
      SpotCoordinate,
    ]),
    FeaturesModule,
    MonthsModule,
    SpotFeatureModule,
    SpotMonthModule,
    RegionModule,
  ],
  controllers: [SpotController],
  providers: [SpotService],
  exports: [
    SpotService,
    TypeOrmModule.forFeature([
      Spot,
      Country,
      Province,
      City,
      District,
      SpotCoordinate,
    ]),
  ],
})
export class SpotModule {}
