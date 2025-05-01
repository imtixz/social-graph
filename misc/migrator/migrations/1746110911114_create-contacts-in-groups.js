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
  pgm.createTable("contacts_in_groups", {
    group_id: {
      type: "integer",
      notNull: true,
      references: "groups(id)",
      onDelete: "CASCADE",
    },
    contact_id: {
      type: "integer",
      notNull: true,
      references: "contacts(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("contacts_in_groups", "contacts_in_groups_primary_key", {
    primaryKey: ["group_id", "contact_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("contacts_in_groups");
};
