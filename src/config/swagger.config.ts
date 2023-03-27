import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';

export const getSwaggerConf = () =>
  new DocumentBuilder()
    .setTitle('ITravel Document')
    .setDescription('ITravel API description')
    .addBearerAuth()
    .setVersion('1.0.0')
    .build();

export const getRedocOptions = (): RedocOptions => ({
  title: 'ITravel Document',
  sortPropsAlphabetically: true,
  hideDownloadButton: false,
  hideHostname: false,
});

export const getSwaggerCustomOptions = (): SwaggerCustomOptions => ({
  swaggerOptions: {
    redocOptions: getRedocOptions(),
  },
});
