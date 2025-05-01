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
  pgm.createTable("contacts_in_reminder", {
    contact_id: {
      type: "integer",
      notNull: true,
      references: "contacts(id)",
      onDelete: "CASCADE",
    },
    reminder_id: {
      type: "integer",
      notNull: true,
      references: "reminders(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint(
    "contacts_in_reminder",
    "contacts_in_reminder_primary_key",
    {
      primaryKey: ["contact_id", "reminder_id"],
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("contacts_in_reminder");
};
