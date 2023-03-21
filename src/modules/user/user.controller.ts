import { ClassSerializerInterceptor, Controller } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Put,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common/decorators';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { BizException } from 'src/shared/exceptions/BizException';
import { TransformUserPipe } from 'src/shared/pipes/user.pipe';
import { TransformUUIDPipe } from 'src/shared/pipes/uuid.pipe';

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
