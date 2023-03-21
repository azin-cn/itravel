import { ClassSerializerInterceptor, Controller } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common/decorators';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { BizException } from 'src/shared/exceptions/BizException';
import {
  TransformUserPipe,
  TransformUserAuthPipe,
} from 'src/shared/pipes/user.pipe';
import { TransformUUIDPipe } from 'src/shared/pipes/uuid.pipe';
import { AuthTypeDTO } from './dto/auth.dto';
import { TrasnformAuthPipe } from 'src/shared/pipes/auth.pipe';
import { UserAuthDTO } from './dto/user.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUserById(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO<User>> {
    const user = await this.userService.findUserById(id);
    if (user) {
      return ResultVO.info(user);
    }
    throw new BizException('用户不存在或已注销');
  }

  @Post('login')
  async userLogin(
    @Body(TransformUserAuthPipe) userDTO: UserAuthDTO,
    @Query(TrasnformAuthPipe) query: AuthTypeDTO,
  ): Promise<User> {
    // 校验用户
    const { type } = query;
    console.log(userDTO, query);
    return await this.userService.login(userDTO, type);
  }

  @Post('register')
  async userRegiser(
    @Body(TransformUserAuthPipe) userDTO: UserAuthDTO,
    @Query(TrasnformAuthPipe) query: AuthTypeDTO,
  ) {
    const { type } = query;
    return await this.userService.register(userDTO, type);
  }

  @Put()
  @UsePipes(new TransformUserPipe())
  async putUser(@Body() user: User): Promise<ResultVO> {
    console.log(user);
    const { affected } = await this.userService.update(user);
    if (affected === 0) {
      throw new BizException('无此用户，更新失败！');
    }
    return ResultVO.success();
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO> {
    const { affected } = await this.userService.delete(id);
    if (affected === 0) {
      throw new BizException('无此用户，删除失败！');
    }
    return ResultVO.success();
  }
}
