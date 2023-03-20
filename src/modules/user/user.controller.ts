import { Controller } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common/decorators';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { BizException } from 'src/shared/exceptions/BizException';
import {
  TransformUserPipe,
  TransformUserRegisterPipe,
} from 'src/shared/pipes/user.pipe';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<ResultVO<User>> {
    const user = await this.userService.findUserById(id);
    if (user) {
      return ResultVO.info(user);
    }
    throw new BizException('用户不存在或已注销');
  }

  @Post()
  @UsePipes(new TransformUserRegisterPipe())
  async postUser(@Body() user: User): Promise<User> {
    console.log(user instanceof User, 'user instanceof User');
    return await this.userService.create(user);
  }

  @Put()
  @UsePipes(new TransformUserPipe())
  async putUser(@Body() user: User): Promise<ResultVO> {
    const { affected } = await this.userService.update(user);
    if (affected === 0) {
      throw new BizException('无此用户，更新失败！');
    }
    return ResultVO.success();
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<ResultVO> {
    const { affected } = await this.userService.delete(id);
    if (affected === 0) {
      throw new BizException('无此用户，删除失败！');
    }
    return ResultVO.success();
  }
}
