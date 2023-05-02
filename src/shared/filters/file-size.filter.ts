import { getOrdefault } from 'src/config/utils';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResultVO } from '../vo/ResultVO';

@Catch(PayloadTooLargeException)
export class FileSizeLimitExceededExceptionFilter implements ExceptionFilter {
  catch(exception: PayloadTooLargeException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const limit = getOrdefault('FILE_SIZE_LIMIT', 10);

    /**
     * 自定义错误信息
     */
    const result = ResultVO.fail(
      `上传文件大小不能超过 ${limit}MB`,
      HttpStatus.PAYLOAD_TOO_LARGE,
    );

    /**
     * 设置响应状态码和错误信息
     */
    response.status(HttpStatus.OK).json(result);
  }
}
