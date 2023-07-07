import { users } from '@/schemas';
import { InferModel } from 'drizzle-orm';

export type CreateUserDto = InferModel<typeof users, 'insert'>;
export type User = InferModel<typeof users, 'select'>;
