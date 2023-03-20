import {
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  HttpException,
  Catch,
} from '@nestjs/common';
import { Response } from 'express';
import { ResultVO } from '../vo/ResultVO';
import { BizException } from '../exceptions/BizException';

export class ProcessException {
  constructor(
    exception: HttpException,
    host: ArgumentsHost,
    type: 'http' | 'biz' = 'http',
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>(); // response对象
    const status = exception.getStatus();
    const eRes = exception.getResponse() as string | { message: string };
    const errMsg = typeof eRes === 'object' ? eRes.message : eRes;
    const result = ResultVO.fail(errMsg, status);

    switch (type) {
      case 'biz':
        response.status(HttpStatus.OK).json(result);
        break;
      default:
        response.status(status).json(result);
    }
  }
}

/**
 * @class HttpExceptionFilter
 * @classdesc 只处理业务异常，不处理系统异常
 * getStatus 可以获取Biz等子类型的code，因为在new BizException中，进行了父类super调用
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if (Object.getPrototypeOf(exception).constructor === BizException) {
      new ProcessException(exception, host, 'biz');
    } else new ProcessException(exception, host);
  }
}
