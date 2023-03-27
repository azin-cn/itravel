import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthTypeDTO, UserAuthDTO } from './dto/auth.dto';
import { TrasnformAuthPipe } from 'src/shared/pipes/auth.pipe';
import { TransformUserAuthPipe } from 'src/shared/pipes/user.pipe';
import { AuthService } from './auth.service';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('activate')
  async userActive(@Query('token') token: string): Promise<ResultVO> {
    const user = await this.authService.activateUserByToken(token);
    return ResultVO.success(user);
  }

  @Post('login')
  async userLogin(
    @Body(TransformUserAuthPipe) userDTO: UserAuthDTO,
    @Query(TrasnformAuthPipe) query: AuthTypeDTO,
  ): Promise<ResultVO> {
    const { type } = query;
    const res = await this.authService.login(userDTO, type);
    return ResultVO.success(res);
  }

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
