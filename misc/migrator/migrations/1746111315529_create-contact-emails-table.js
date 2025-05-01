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
  pgm.createTable("contact_emails", {
    email: {
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
  pgm.createConstraint("contact_emails", "contact_emails_primary_key", {
    primaryKey: ["email", "contact_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("contact_emails");
};
