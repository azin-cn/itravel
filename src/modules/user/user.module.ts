import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TitleModule } from '../title/title.module';
import { ArticleModule } from '../article/article.module';
import { TagModule } from '../tag/tag.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // ArticleModule,
    // TagModule,
    TitleModule,
    AuthModule,
    // 延迟加载问题，循环依赖问题
  ], // dynamic module
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
