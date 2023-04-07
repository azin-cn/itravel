import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthTypeDTO, UserAuthDTO } from './dto/auth.dto';
import { TrasnformAuthPipe } from 'src/shared/pipes/auth.pipe';
import { TransformUserAuthPipe } from 'src/shared/pipes/user.pipe';
import { AuthService } from './auth.service';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: '用户激活' })
  @Get('activate')
  async userActive(@Query('token') token: string): Promise<ResultVO> {
    const user = await this.authService.activateUserByToken(token);
    return ResultVO.success(user);
  }

  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  async userLogin(
    @Body(TransformUserAuthPipe) userDTO: UserAuthDTO,
    @Query(TrasnformAuthPipe) query: AuthTypeDTO,
  ): Promise<ResultVO> {
    const { type } = query;
    const res = await this.authService.login(userDTO, type);
    console.log(res);
    return ResultVO.success(res);
  }

  @ApiOperation({ summary: '用户注销' })
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async userLogout(): Promise<ResultVO> {
    return ResultVO.success();
  }

  @ApiOperation({ summary: '用户注册' })
  @Post('register')
  async userRegiser(
    @Body(TransformUserAuthPipe) userDTO: UserAuthDTO,
    @Query(TrasnformAuthPipe) query: AuthTypeDTO,
  ): Promise<ResultVO> {
    const { type } = query;
    const { id } = await this.authService.register(userDTO, type);
    return ResultVO.success({ id });
  }
}
