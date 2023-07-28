import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '@/utils/decorators/current.user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findUserById(@CurrentUser('sub') userId: string) {
    return await this.usersService.findUser({ query: 'id', value: userId });
  }
}
