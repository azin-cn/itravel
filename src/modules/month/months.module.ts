import { Module } from '@nestjs/common';
import { MonthsService } from './months.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Month } from 'src/entities/month.entity';
import { MonthController } from './month.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Month])],
  providers: [MonthsService],
  exports: [MonthsService, TypeOrmModule.forFeature([Month])],
  controllers: [MonthController],
})
export class MonthsModule {}
