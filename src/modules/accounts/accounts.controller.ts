import { Body, Controller, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CurrentUser } from '@/utils/decorators/current.user.decorator';
import { CreateAccountPasswordParams } from './accounts.types';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async createAccount(
    @CurrentUser('sub')
    userId: string,
    @Body() accountParams: CreateAccountPasswordParams,
  ) {
    return await this.accountsService.createAccount({
      userId,
      ...accountParams,
    });
  }
}
