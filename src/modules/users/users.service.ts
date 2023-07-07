import { Injectable } from '@nestjs/common';
import { like } from 'drizzle-orm';
import { users } from '@/schemas';
import { type Database, InjectDrizzle } from '@/modules/database';
import { type CreateUserDto } from './users.types';
import { createSHA256, cuid } from '@/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectDrizzle()
    private readonly db: Database,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password, email, ...createUser } = createUserDto;

    const hash = createSHA256(password);

    return await this.db
      .insert(users)
      .values({
        ...createUser,
        id: cuid(),
        email: email.toLowerCase(),
        password: hash,
      })
      .returning();
  }

  async findUser(username: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(like(users.email, `%${username}%`))
      .limit(1)
      .execute();

    return user;
  }
}
