import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post } from '@nestjs/common/decorators';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { UserCreateDTO } from 'src/modules/user/dto/user.dto';
import { ResultVO } from 'src/shared/vo/ResultVO';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<ResultVO<User>> {
    const user = await this.userService.getUserById(id);
    return ResultVO.info(user);
  }

  @Post()
  async postUser(@Body() user: UserCreateDTO): Promise<User> {
    return await this.userService.create(user);
  }
}
