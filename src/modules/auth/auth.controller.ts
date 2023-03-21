import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthTypeDTO, UserAuthDTO } from './dto/auth.dto';
import { TrasnformAuthPipe } from 'src/shared/pipes/auth.pipe';
import { TransformUserAuthPipe } from 'src/shared/pipes/user.pipe';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async userLogin(
    @Body(TransformUserAuthPipe) userDTO: UserAuthDTO,
    @Query(TrasnformAuthPipe) query: AuthTypeDTO,
  ): Promise<User> {
    // 校验用户
    const { type } = query;
    return await this.authService.login(userDTO, type);
  }

  @Post('register')
  async userRegiser(
    @Body(TransformUserAuthPipe) userDTO: UserAuthDTO,
    @Query(TrasnformAuthPipe) query: AuthTypeDTO,
  ) {
    const { type } = query;
    return await this.authService.register(userDTO, type);
  }
}
