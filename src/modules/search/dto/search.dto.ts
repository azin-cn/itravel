import { IsNotEmpty, IsString } from 'class-validator';

export class SearchDTO {
  @IsString()
  @IsNotEmpty({ message: '搜索字符串为空' })
  s: string;
}
