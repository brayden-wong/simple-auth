import { UsersService } from '@/modules/users';
import { Inject, Injectable } from '@nestjs/common';
import { compareAES } from '@/utils';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUser({
      query: 'email',
      value: username,
    });

    if (!user || !compareAES(password, user.password)) return null;

    return { id: user.id };
  }

  async login(userId: string) {
    return this.generateTokens(userId);
  }

  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          expiresIn: '15m',
          secret: this.config.get<string>('AT_SECRET'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          expiresIn: '30d',
          secret: this.config.get<string>('RT_SECRET'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
