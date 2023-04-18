import { Injectable } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class UploadService {
  constructor() {}

  async save(file: Express.Multer.File) {}
}
