import { Module } from '@nestjs/common';
import { UsersModule } from '../users';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService, LocalStrategy } from './services';
import { LocalGuard } from './guards';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './services/strategies/at.strategy';
import { AtGuard } from './guards/at.guard';

@Module({
  imports: [JwtModule.register({}), PassportModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalGuard, AtStrategy, AtGuard],
  exports: [AuthService],
})
export class AuthModule {}
