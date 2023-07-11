import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { eq, like } from 'drizzle-orm';
import { users } from '@/schemas';
import { createSHA256, cuid } from '@/utils';

import { type Database, InjectDrizzle } from '@/modules/database';
import { type CreateUserDto } from './users.types';

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

  async updatePassword({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    return await this.db.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, username),
      });

      if (!user) throw new NotFoundException('User not found');

      const hash = createSHA256(password);

      return await tx
        .update(users)
        .set({ password: hash })
        .where(eq(users.id, user.id))
        .returning()
        .execute();
    });
  }
}
