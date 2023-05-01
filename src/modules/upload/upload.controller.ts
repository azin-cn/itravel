import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { UploadVO } from './vo/spot.vo';
import { getOrdefault } from 'src/config/utils';
import * as path from 'path';

@ApiTags('上传')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @ApiOperation({ summary: '上传图像' })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadFile(
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<ResultVO> {
    const hostname = getOrdefault('CUSTOMER_HOSTNAME', 'localhost');
    const uploadDir = getOrdefault('UPLOAD_DIR', 'upload');
    const { filename, originalname } = file;
    /**
     * \\ 不需要转义
     */
    const filepath = file.path.replace(/\\/g, '/');
    const index = filepath.search(new RegExp(`/${uploadDir}/`));
    const suffix = filepath.slice(index);
    const url = `${hostname}${suffix}`;

    return ResultVO.success(new UploadVO(url, filename));
  }

  @ApiOperation({ summary: '通过路径获取文件(伪静态)' })
  @Get(':path(*)')
  async getFile(@Param('path') filepath: string, @Res() res: Response) {
    console.log(filepath);
    const uploadDir = getOrdefault('UPLOAD_DIR', 'upload');
    res.sendFile(filepath, { root: uploadDir });
  }
}
