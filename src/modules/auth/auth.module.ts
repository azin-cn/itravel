import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Title } from 'src/entities/title.entity';
import { TitleService } from '../title/title.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Title])],
  providers: [AuthService, UserService, TitleService],
  controllers: [AuthController],
})
export class AuthModule {}
