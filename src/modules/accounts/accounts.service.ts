import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Database, InjectDrizzle } from '../database';
import { CreateAccountDto } from './accounts.types';
import { accounts } from '@/schemas/accounts';
import { cuid, createAES } from '@/utils/functions';

@Injectable()
export class AccountsService {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async createAccount({ userId, password, username }: CreateAccountDto) {
    const account = await this.db.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({
        columns: {
          password: true,
        },
        where: (users, { eq }) => eq(users.id, userId),
      });

      if (!user) throw new UnauthorizedException();

      password = createAES(password, user.password);

      const [account] = await tx
        .insert(accounts)
        .values({
          id: cuid(),
          userId,
          password,
          username,
        })
        .returning();

      return account;
    });

    return account;
  }
}
