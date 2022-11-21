import { Controller, Get, Post, Body, Param, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): string {
    return ['Hello', 'World', 'Hello', 'NestJS'].reduce(
      (prev: string, curr: string): string => {
        return prev + ' ' + curr;
      },
      '',
    );
  }

  // 可以直接通过req拿到参数，也可以通过注入的形式（已封装）@Param，@Query，@Body等拿到数据

  @Post()
  postHello(@Body() body: any): string {
    console.log(body);
    return JSON.stringify(body);
  }

  @Post('/:id')
  postId(@Param('id') id: string, @Body() body: object): any {
    return {
      id,
      type: typeof id,
      body,
    };
  }

  @Get(':id')
  getId(
    @Res({ passthrough: true }) res: any,
    @Param('id') id: string,
    @Query() query: any,
  ): any {
    // console.log(res);

    if (parseInt(id) === 5) return query;

    return { id, query };
  }
}
