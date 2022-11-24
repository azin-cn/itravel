import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import envConfig from './config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        // type: configService.get('DB_TYPE', 'mysql'), error，ts 类型检测
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        database: configService.get('DB_NAME', 'web'),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', 'root'),
        logger: 'debug',
        entities: [],
        autoLoadEntities: true,
        timezone: '+08:00', // 时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
