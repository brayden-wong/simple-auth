import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { accounts } from '@/schemas/accounts';
import { users } from '@/schemas';
import { createAES, decrypt, cuid } from '@/utils';

import { QueryParam, type CreateUserDto, Account } from './users.types';
import { type Database, InjectDrizzle } from '@/modules/database';

@Injectable()
export class UsersService {
  constructor(
    @InjectDrizzle()
    private readonly db: Database,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password, email, ...createUser } = createUserDto;

    const hash = createAES(password);

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

  async findUser({ query, value }: QueryParam) {
    const data = await this.db.transaction(async (tx) => {
      const returnedQuery = await this.getQuery({ query, value });

      const userInfo = await tx.query.users.findFirst({
        where: returnedQuery,
      });

      if (!userInfo) throw new UnauthorizedException('User not authorized');

      const user = await this.db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          password: users.password,
          account: {
            id: accounts.id,
            username: accounts.username,
            password: accounts.password,
            userId: accounts.userId,
          },
        })
        .from(users)
        .where(eq(users.id, userInfo.id))
        .leftJoin(accounts, eq(accounts.userId, userInfo.id))
        .execute();

      return user;
    });

    const accArray: Array<Account> = [];
    data.map((user) => {
      if (user.account)
        user.account.password = decrypt(user.account.password, user.password);
      accArray.push(user.account);
    });

    return {
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
      password: data[0].password,
      accounts: accArray,
    };
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

      const hash = createAES(password);

      return await tx
        .update(users)
        .set({ password: hash })
        .where(eq(users.id, user.id))
        .returning()
        .execute();
    });
  }

  async getUserAccounts({ query, value }: QueryParam) {
    const data = await this.findUser({ query, value });
  }

  private async getQuery({ query, value }: QueryParam) {
    return query === 'id' ? eq(users.id, value) : eq(users.email, value);
  }
}
