import { IsDate, IsOptional, IsString } from 'class-validator';

export class AdminBaseDTO {}

export class SpotSearchDTO {
  @IsOptional()
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  region: string;

  @IsOptional()
  @IsString()
  // @IsDate({ message: '时间格式不正确' })
  create_date_before: string;

  @IsOptional()
  @IsString()
  // @IsDate({ message: '时间格式不正确' })
  create_date_after: string;
}

export class ArticleSearchDTO {
  @IsOptional()
  id: string;

  @IsOptional()
  keywords: string;

  @IsOptional()
  username: string;

  @IsOptional()
  @IsString()
  // @IsDate({ message: '时间格式不正确' })
  create_date_before: string;

  @IsOptional()
  @IsString()
  // @IsDate({ message: '时间格式不正确' })
  create_date_after: string;
}
