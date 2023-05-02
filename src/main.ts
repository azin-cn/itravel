import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpResponseInterceptor } from './shared/interceptors/http-response.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import { knife4jSetup } from 'nest-knife4j';
import {
  getSwaggerConf,
  getSwaggerCustomOptions,
} from './config/swagger.config';
import { getOrdefault } from './config/utils';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  app.use((req, res: Response, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  // bug 配置文件是异步加载的，在这里不能获取到配置文件内容
  app.setGlobalPrefix(getOrdefault('API_PREFIX', '/api/v1'));

  const document = SwaggerModule.createDocument(app, getSwaggerConf());
  // await RedocModule.setup('/docs', app, document, getRedocOptions());
  SwaggerModule.setup('api', app, document, getSwaggerCustomOptions());
  knife4jSetup(app, [
    {
      name: 'Itravel',
      url: '/api-json',
      swaggerVersion: '2.0',
      location: '/api-json',
    },
  ]);

  // app.useGlobalInterceptors(new HttpResponseInterceptor());
  await app.listen(process.env.PORT);
}
bootstrap();
