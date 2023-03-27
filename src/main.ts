import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpResponseInterceptor } from './shared/interceptors/http-response.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConf } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, getSwaggerConf());
  SwaggerModule.setup('api', app, document);

  // app.useGlobalInterceptors(new HttpResponseInterceptor());
  await app.listen(process.env.PORT);
}
bootstrap();
