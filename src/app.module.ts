import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Country } from './entities/country.entity';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { Spot } from './entities/spot.entity';
import { SpotMonth } from './entities/spot-month.entity';
import { SpotFeature } from './entities/spot-feature.entity';
import { Month } from './entities/month.entity';
import { Feature } from './entities/feature.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: configService.get('DB_TYPE', 'mysql'), error，ts 类型检测
      type: 'mysql',
      host: '146.56.116.51',
      port: 3306,
      database: 'web',
      username: 'web',
      password: 'pM0dH4gD6xJ9vN7z',
      logging: 'all',
      entities: [],
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(), // 将实体中的小驼峰变为蛇形
      timezone: '+08:00', // 时区
      charset: 'utf8mb4',
      synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
    }),
    TypeOrmModule.forFeature([
      Country,
      Province,
      City,
      District,
      Spot,
      Month,
      Feature,
      SpotMonth,
      SpotFeature,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
