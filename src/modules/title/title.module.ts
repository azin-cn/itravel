import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Title } from 'src/entities/title.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Title])],
  providers: [TitleService],
  exports: [TypeOrmModule.forFeature([Title]), TitleService],
})
export class TitleModule {}
