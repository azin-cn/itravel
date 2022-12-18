import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post } from '@nestjs/common/decorators';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { UserCreateDTO } from 'src/modules/user/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Post()
  async postUser(@Body() user: UserCreateDTO): Promise<User> {
    return await this.userService.create(user);
  }
}
