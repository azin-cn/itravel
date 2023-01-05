import { ResultCode } from './ResultHelp';

export declare class IPagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export declare class IData<T = object> {
  info?: T;
  list?: T[];
  pagination?: IPagination;

  [properties: string]: any;
}

type IResult<T = object> = InstanceType<typeof ResultVO<T>>;

export class ResultVO<T = object> {
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

  public static failure() {
    return new ResultVO();
  }

  public static success<T = object>(): IResult<T> {
    return new ResultVO<T>(ResultCode.SUCCESS, 'success');
  }

  public static info<T = object>(info: T): IResult<T> {
    const result = ResultVO.success<T>();
    result.data = { info };
    return result;
  }

  public static list<T = object>(
    list: T[],
    pagination?: IPagination,
  ): IResult<T> {
    const result = ResultVO.success<T>();
    result.data = { list, pagination };
    return result;
  }
}
