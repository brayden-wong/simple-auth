import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
config({ path: '.env.migration' });

export default {
  schema: './src/schemas',
  driver: 'pg',
  dbCredentials: {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  },
  out: './.drizzle',
} satisfies Config;
