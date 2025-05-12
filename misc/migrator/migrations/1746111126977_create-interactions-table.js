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
  pgm.createTable("interactions", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    date: {
      type: "timestamp",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: true,
    },
    contact_id: {
      type: "integer",
      notNull: true,
      references: "contacts(id)",
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
  pgm.dropTable("interactions");
};

// CREATE TABLE interactions (
//   id SERIAL PRIMARY KEY NOT NULL,
//   date TIMESTAMP NOT NULL,
//   description TEXT NOT NULL,
//   contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE
// );
