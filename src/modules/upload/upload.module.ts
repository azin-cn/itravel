import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { getMuterConf } from 'src/config/upload.config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: getMuterConf,
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
