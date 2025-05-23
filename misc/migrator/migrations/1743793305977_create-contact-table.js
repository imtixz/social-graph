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
  pgm.createTable("contacts", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    name: {
      type: "text",
      notNull: true,
    },
    address: {
      type: "text",
      notNull: true,
    },
    date_of_birth: {
      type: "date",
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
  pgm.dropTable("contacts");
};

// CREATE TABLE contacts (
//   id SERIAL PRIMARY KEY NOT NULL,
//   name TEXT NOT NULL,
//   address TEXT NOT NULL,
//   date_of_birth DATE,
//   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
// );
