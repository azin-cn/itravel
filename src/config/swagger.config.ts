import { DocumentBuilder } from '@nestjs/swagger';

export const getSwaggerConf = () =>
  new DocumentBuilder()
    .setTitle('ITravel Document')
    .setDescription('ITravel API description')
    .setVersion('1.0.0')
    .addTag('itravel')
    .addBearerAuth()
    .build();
