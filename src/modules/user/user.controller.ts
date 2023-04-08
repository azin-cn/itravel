import { ClassSerializerInterceptor, Controller } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common/decorators';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { ResultVO } from 'src/shared/vo/ResultVO';
import { TransformUserPipe } from 'src/shared/pipes/user.pipe';
import { TransformUUIDPipe } from 'src/shared/pipes/uuid.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Assert } from 'src/utils/Assert';
import { UserDTO } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: '获取用户简略信息' })
  @ApiParam({ name: 'id', type: String })
  @Get('brief/:id')
  async getUserBriefInfo(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO> {
    return ResultVO.success();
  }

  @ApiOperation({ summary: '获取用户详情信息' })
  @ApiParam({ name: 'id', type: String })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserById(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO<User>> {
    const user = await this.userService.findActiveUserById(id);
    Assert.isNotEmptyUser(user);
    return ResultVO.success(user);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiBody({ type: UserDTO })
  @UseGuards(AuthGuard('jwt'))
  @Put()
  @UsePipes(new TransformUserPipe())
  async putUser(@Body() user: User): Promise<ResultVO> {
    // const { affected } = await this.userService.update(user);
    // if (affected === 0) {
    //   throw new BadRequestException('无此用户，更新失败');
    // }
    return ResultVO.success();
  }

  @ApiOperation({ summary: '删除用户信息' })
  @ApiParam({ name: 'id' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUser(
    @Param('id', TransformUUIDPipe) id: string,
  ): Promise<ResultVO> {
    /**
     * 通过设置 isDeleted 来指定删除
     */
    const { affected } = await this.userService.delete(id);
    Assert.isNotZero(affected, '无此用户，删除失败！');
    return ResultVO.success();
  }
}
