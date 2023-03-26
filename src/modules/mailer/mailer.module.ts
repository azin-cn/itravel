import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { getMailerConf } from 'src/config/mailer.config';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: getMailerConf,
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
