import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResultVO } from '../vo/ResultVO';

export class HttpResponseInterceptor<T> implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<ResultVO<T>> {
    // 异常并不会走到interceptor，此时的data已经失去了class信息
    return next.handle().pipe(
      map((data: T) => {
        console.log(Object.getPrototypeOf(data));
        if (data instanceof ResultVO) {
          return data;
        }
        if (data instanceof Array) {
          return ResultVO.list(data, data.length);
        }
        return ResultVO.info(data);
      }),
    );
  }
}
