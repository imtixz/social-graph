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
  pgm.createTable("contact_notes", {
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
  pgm.dropTable("contact_notes");
};
