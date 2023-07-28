import {
  Body,
  Controller,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from '@/utils/decorators';
import { CreateUserDto, UsersService } from '../users';
import { AuthService } from './services';
import { LocalGuard } from './guards';
import { CurrentUser } from '@/utils/decorators/current.user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    const user = await this.usersService.createUser(createUserDto);

    return user;
  }

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@CurrentUser('sub') userId: string) {
    console.log(userId);
    return this.authService.login(userId);
  }

  @Patch('update-password')
  async updatePassword(
    @Body()
    updatePassword: {
      username: string;
      password: string;
    },
  ) {
    return this.usersService.updatePassword(updatePassword);
  }
}
