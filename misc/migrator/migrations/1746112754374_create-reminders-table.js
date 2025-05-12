/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("reminders", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    title: {
      type: "text",
      notNull: true,
    },
    body: {
      type: "text",
      notNull: true,
    },
    remind_on: {
      type: "timestamp",
      notNull: false,
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("reminders");
};

// CREATE TABLE reminders (
//   id SERIAL PRIMARY KEY NOT NULL,
//   title TEXT NOT NULL,
//   body TEXT NOT NULL,
//   remind_on TIMESTAMP,
//   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
// );
