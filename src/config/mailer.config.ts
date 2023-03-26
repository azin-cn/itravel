import { MailerOptions } from '@nestjs-modules/mailer';
import { getOrdefault } from './utils';

export const getMailerConf = (): MailerOptions => ({
  transport: {
    host: getOrdefault('MAILER_SMTP', ''),
    port: getOrdefault('MAILER_PORT', '465'),
    secure: true,
    auth: {
      user: getOrdefault('MAILER_ACCOUNT', ''),
      pass: getOrdefault('MAILER_PASSWORD', ''),
    },
  },
  preview: true,
  defaults: {
    from: getOrdefault('MAILER_ACCOUNT', ''),
  },
});
