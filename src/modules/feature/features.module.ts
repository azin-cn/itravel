import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from 'src/entities/feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  providers: [FeaturesService],
  exports: [FeaturesService, TypeOrmModule.forFeature([Feature])],
})
export class FeaturesModule {}
