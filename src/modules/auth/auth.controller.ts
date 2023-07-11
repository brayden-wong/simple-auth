import {
  Body,
  Controller,
  Inject,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UsersService } from '../users';
import { AuthService } from './services';
import { LocalGuard } from './guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    const user = await this.usersService.createUser(createUserDto);

    return user;
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    return req.user;
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
