import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpResponseInterceptor } from './shared/interceptors/http-response.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import {
  getRedocOptions,
  getSwaggerConf,
  getSwaggerCustomOptions,
} from './config/swagger.config';
import { RedocModule } from 'nestjs-redoc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, getSwaggerConf());
  await SwaggerModule.setup('/docs', app, document, getSwaggerCustomOptions());
  // await RedocModule.setup('/docs', app, document, getRedocOptions());

  // app.useGlobalInterceptors(new HttpResponseInterceptor());
  await app.listen(process.env.PORT);
}
bootstrap();
