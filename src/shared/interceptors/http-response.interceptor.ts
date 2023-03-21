import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResultVO } from '../vo/ResultVO';

export class HttpResponseInterceptor<T> implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<ResultVO<T>> {
    // 异常并不会走到interceptor
    return next.handle().pipe(
      map((data: T) => {
        if (data instanceof ResultVO) {
          return data;
        }
        if (data instanceof Array) {
          return ResultVO.list(data);
        }
        return ResultVO.info(data);
      }),
    );
  }
}
