export * from './schema';
export * from './seed';
import * as schema from './schema';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

export function createDatabaseClient(connectionString?: string) {
  const url = connectionString || process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/school_cms';
  const client = postgres(url, { max: 20 });
  return drizzle(client, { schema });
}
