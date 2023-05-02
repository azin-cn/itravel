import { Module } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import envConfig from './env';
import { getDBConf } from './config/db.config';

import { ArticleModule } from './modules/article/article.module';
import { UserModule } from './modules/user/user.module';
import { TitleModule } from './modules/title/title.module';
import { TagModule } from './modules/tag/tag.module';

import { GLOBAL_FILTERS } from './shared/filters';
import { GLOBAL_PIPES } from './shared/pipes';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { CategoryModule } from './modules/category/category.module';
import { CommentModule } from './modules/comment/comment.module';
import { SearchModule } from './modules/search/search.module';
import { SpotModule } from './modules/spot/spot.module';
import { MonthsModule } from './modules/month/months.module';
import { FeaturesModule } from './modules/feature/features.module';
import { SpotFeatureModule } from './modules/spot-feature/spot-feature.module';
import { SpotMonthModule } from './modules/spot-month/spot-month.module';
import { RegionModule } from './modules/region/region.module';
import { UploadModule } from './modules/upload/upload.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局，并自动读取配置文件
      // envFilePath: [envConfig.path], 采用 ts 文件配置形式，dotenv会默认读取根路径下的env文件
      // 读取时异步的，需要使用ConfigService|dotenv才能真正正确的获取数据（提供promise的形式），
      // 其他方式可能早于App初始化获取，所获取的数据为空
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => getDBConf(),
    }),
    UserModule,
    ArticleModule,
    TitleModule,
    TagModule,
    AuthModule,
    MailerModule,
    CategoryModule,
    CommentModule,
    SearchModule,
    SpotModule,
    MonthsModule,
    FeaturesModule,
    SpotFeatureModule,
    SpotMonthModule,
    RegionModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...GLOBAL_FILTERS, ...GLOBAL_PIPES],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
