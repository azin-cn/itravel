import { ResultCode } from './ResultHelp';

export declare class IPagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export declare class IDataPagination<T = unknown> {
  info?: T;
  list?: T[];
  pagination?: IPagination;

  [properties: string]: any;
}

type IData<T = unknown> =
  | IDataPagination<T>
  | string
  | number
  | boolean
  | null
  | undefined;

type IResult<T = unknown> = InstanceType<typeof ResultVO<T>>;

export class ResultVO<T = unknown> {
  constructor(
    private errCode?: number,
    private errMsg?: string,
    private data?: IData<T>,
  ) {}

  public setCode(errCode: number) {
    this.errCode = errCode;
  }
  public setMsg(errMsg: string) {
    this.errMsg = errMsg;
  }
  public setData(data: IData<T>) {
    this.data = data;
  }

  public static fail(errMsg = 'fail', errCode = ResultCode.FAIL) {
    return new ResultVO(errCode, errMsg);
  }

  public static success<T = unknown>(
    data?: T,
    errMsg = 'success',
    errCode = ResultCode.SUCCESS,
  ): IResult<T> {
    return new ResultVO<T>(errCode, errMsg, data);
  }

  public static info<T = unknown>(info: T): IResult<T> {
    const result = ResultVO.success<T>();
    result.data = { info };
    return result;
  }

  public static list<T = unknown>(
    list: T[],
    total: number,
    pagination?: IPagination,
  ): IResult<T> {
    const result = ResultVO.success<T>();
    result.data = { list, total, pagination };
    return result;
  }
}
