import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import {
  getDrizzleConfigToken,
  getDrizzleInstanceToken,
} from './drizzle.constants';
import type { DrizzleConfig } from './drizzle.types';

import * as schema from '@/schemas';

@Global()
@Module({
  providers: [
    {
      provide: getDrizzleConfigToken(),
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('PG_HOST'),
        database: config.get<string>('PG_DATABASE'),
        port: config.get<number>('PG_PORT'),
        user: config.get<string>('PG_USER'),
        password: config.get<string>('PG_PASSWORD'),
      }),
    },
    {
      provide: getDrizzleInstanceToken(),
      inject: [getDrizzleConfigToken()],
      useFactory: async (config: DrizzleConfig) => {
        const client = new Client(config);

        await client.connect();

        return drizzle(client, { logger: true, schema });
      },
    },
  ],
  exports: [getDrizzleInstanceToken()],
})
export class DrizzleModule {}
