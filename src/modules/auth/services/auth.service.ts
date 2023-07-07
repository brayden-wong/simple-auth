import { UsersService } from '@/modules/users';
import { Inject, Injectable } from '@nestjs/common';
import { compareHash } from '@/utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUser(username);

    if (!user || !compareHash(password, user.password)) return null;

    return { id: user.id };
  }
}
