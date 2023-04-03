import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpResponseInterceptor } from './shared/interceptors/http-response.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import { knife4jSetup } from 'nest-knife4j';
import {
  getRedocOptions,
  getSwaggerConf,
  getSwaggerCustomOptions,
} from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
