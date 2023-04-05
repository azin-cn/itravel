import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from 'src/entities/feature.entity';
import { FeatureController } from './feature.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  providers: [FeaturesService],
  exports: [FeaturesService, TypeOrmModule.forFeature([Feature])],
  controllers: [FeatureController],
})
export class FeaturesModule {}
