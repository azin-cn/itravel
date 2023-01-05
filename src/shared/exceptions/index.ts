import { HttpException, HttpStatus } from '@nestjs/common';

export type IException = Record<
  string,
  {
    errCode: number;
    errMsg: string;
  }
>;



export class BasicException extends HttpException {
  constructor(
    errCode: number,
    errMsg: string = 'Internal server error',
    httpCode: number = HttpStatus.INTERNAL_SERVER_ERROR, // server_error 500
  ) {
    super({ errCode, errMsg }, httpCode);
  }
}

// export class BlankException extends HttpException {
//   constructor(
//     private errMsg = '未找到对应资源',
//     private errCode = ExceptionStatus.NOT_FOUND,
//   ) {
//     super({ errCode, errMsg }, HttpStatus.OK);
//   }
// }

export const registeExcetion =
  (Exception: IException, key: string) => (errMsg: string, errCode: number) => {
    Exception[key] = { errCode, errMsg };
  };
