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
  pgm.createType("social_type", [
    "facebook",
    "instagram",
    "twitter",
    "linkedin",
  ]);

  pgm.createTable("contact_socials", {
    link: {
      type: "text",
      notNull: true,
    },
    type: {
      type: "social_type",
      notNull: true,
    },
    contact_id: {
      type: "integer",
      notNull: true,
      references: "contacts(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.createConstraint("contact_socials", "contact_socials_primary_key", {
    primaryKey: ["link", "type", "contact_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("contact_socials");
  pgm.dropType("social_type");
};

// CREATE TYPE social_type AS ENUM (
//   'facebook',
//   'instagram',
//   'twitter',
//   'linkedin'
// );

// CREATE TABLE contact_socials (
//   link TEXT NOT NULL,
//   type social_type NOT NULL,
//   contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
//   PRIMARY KEY (link, type, contact_id)
// );
