import { DB } from "./db/db";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_PORT } from "./env";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: DB_NAME,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});
