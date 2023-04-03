import { Module } from '@nestjs/common';
import { MonthsService } from './months.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Month } from 'src/entities/month.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Month])],
  providers: [MonthsService],
  exports: [MonthsService, TypeOrmModule.forFeature([Month])],
})
export class MonthsModule {}
