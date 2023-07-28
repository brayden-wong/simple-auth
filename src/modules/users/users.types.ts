import { users } from '@/schemas';
import { InferModel } from 'drizzle-orm';

export type CreateUserDto = InferModel<typeof users, 'insert'>;
export type User = InferModel<typeof users, 'select'>;

export type QueryParam = {
  query: 'id' | 'email';
  value: string;
};

export type Account = {
  id: string;
  username: string;
  password: string;
  userId: string;
};
