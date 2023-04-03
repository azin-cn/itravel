import { Module } from '@nestjs/common';
import { SpotFeatureService } from './spot-feature.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotFeature } from 'src/entities/spot-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpotFeature])],
  providers: [SpotFeatureService],
  exports: [SpotFeatureService, TypeOrmModule.forFeature([SpotFeature])],
})
export class SpotFeatureModule {}
