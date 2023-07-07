import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto, UsersService } from '../users';
import { AuthService } from './services';
import { LocalGuard } from './guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    const user = await this.userService.createUser(createUserDto);

    return user;
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    return req.user;
  }
}
