import * as path from 'path';
import { MulterModuleOptions } from '@nestjs/platform-express';
import * as Muter from 'multer';
import { Express } from 'express';
import { randomUUID } from 'crypto';
import { getOrdefault } from './utils';

export const getMuterConf = (): MulterModuleOptions => ({
  storage: Muter.diskStorage({
    destination: path.join(
      __dirname,
      `../../${getOrdefault(
        'UPLOAD_DIR',
        'upload',
      )}/${new Date().toLocaleDateString()}`,
    ),
    filename: (req, file: Express.Multer.File, cb) => {
      const filename = `${file.originalname}-${randomUUID()}.${
        file.mimetype.split('/')[1]
      }`;
      cb(null, filename);
    },
  }),
});
