import { Module } from '@nestjs/common';
import { SpotMonthService } from './spot-month.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotMonth } from 'src/entities/spot-month.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpotMonth])],
  providers: [SpotMonthService],
  exports: [SpotMonthService, TypeOrmModule.forFeature([SpotMonth])],
})
export class SpotMonthModule {}
