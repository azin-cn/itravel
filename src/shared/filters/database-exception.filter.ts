import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError, ConnectionNotFoundError } from 'typeorm';
import { ResultVO } from '../vo/ResultVO';
import { ResultCode } from '../vo/ResultHelp';

@Catch(QueryFailedError, ConnectionNotFoundError)
export class DatabaseQueryExceptionFilter implements ExceptionFilter {
  catch(
    exception: QueryFailedError | ConnectionNotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errCode = ResultCode.DATABASEFAIL;
    const errMsg = '请联系管理员，业务操作失败';
    const result = ResultVO.fail(errMsg, errCode);
    response.status(HttpStatus.OK).json(result);
  }
}
