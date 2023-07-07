import { Module } from '@nestjs/common';
import { UsersModule } from '../users';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService, LocalStrategy } from './services';
import { LocalGuard } from './guards';

@Module({
  imports: [PassportModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalGuard],
  exports: [AuthService],
})
export class AuthModule {}
