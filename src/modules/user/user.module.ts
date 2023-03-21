import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Title } from 'src/entities/title.entity';
import { Article } from 'src/entities/article.entity';
import { Tag } from 'src/entities/tag.entity';
import { TitleService } from '../title/title.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Title, Article, Tag])], // dynamic module
  controllers: [UserController],
  providers: [UserService, TitleService, AuthService],
  exports: [TypeOrmModule],
})
export class UserModule {}
