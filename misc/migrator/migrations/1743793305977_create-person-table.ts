import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("people", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    first_name: {
      type: "varchar(255)",
      notNull: true,
    },
    last_name: {
      type: "varchar(255)",
      notNull: true,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
