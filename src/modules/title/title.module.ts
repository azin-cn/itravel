import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Title } from 'src/entities/title.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Title, User])],
  providers: [TitleService],
})
export class TitleModule {}
