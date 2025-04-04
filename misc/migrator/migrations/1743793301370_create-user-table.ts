import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

// CREATE TABLE users
// (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL UNIQUE
// );

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
