import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth';
import { UsersModule } from './modules/users';
import { DrizzleModule } from './modules/database';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DrizzleModule,
    UsersModule,
  ],
  controllers: [UsersController],
})
export class AppModule {}
