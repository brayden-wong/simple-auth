import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth';
import { UsersModule } from './modules/users';
import { DrizzleModule } from './modules/database';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './modules/auth/guards/at.guard';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [
    AccountsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DrizzleModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
