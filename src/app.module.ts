import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import envConfig from './config/env';
import { getDBConf } from './config/db.config';

import { ArticleModule } from './modules/article/article.module';
import { UserModule } from './modules/user/user.module';
import { TitleModule } from './modules/title/title.module';
import { TagModule } from './modules/tag/tag.module';

import { GLOBAL_FILTERS } from './shared/filters';
import { GLOBAL_PIPES } from './shared/pipes';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局，并自动读取配置文件
      // envFilePath: [envConfig.path], 采用 ts 文件配置形式，dotenv会默认读取根路径下的env文件
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => getDBConf(),
    }),
    ArticleModule,
    UserModule,
    TitleModule,
    TagModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...GLOBAL_FILTERS, ...GLOBAL_PIPES],
})
export class AppModule {}
