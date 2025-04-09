import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

// CREATE TYPE social_media_urls_type AS (
//   facebook TEXT[],
//   instagram TEXT[],
//   linkedin TEXT[]
// );

// CREATE TABLE people (
//   id SERIAL PRIMARY KEY NOT NULL,
//   name VARCHAR(255) NOT NULL,
//   date_of_birth DATE,
//   profile_picture VARCHAR(255),
//   bio TEXT,
//   phone_numbers TEXT[],
//   emails TEXT[],
//   addresses TEXT[],
//   social_media_urls social_media_urls_type,
//   notes TEXT[],
//   created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
//   updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
//   deleted_at TIMESTAMP
// );

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("social_media_urls_type", {
    facebook: "text[]",
    instagram: "text[]",
    linkedin: "text[]",
  });

  pgm.createTable("people", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    date_of_birth: {
      type: "date",
      notNull: false,
    },
    profile_picture: {
      type: "varchar(255)",
      notNull: false,
    },
    bio: {
      type: "text",
      notNull: false,
    },
    phone_numbers: {
      type: "text[]",
      notNull: false,
    },
    emails: {
      type: "text[]",
      notNull: false,
    },
    addresses: {
      type: "text[]",
      notNull: false,
    },
    social_media_urls: {
      type: "social_media_urls_type",
      notNull: false,
    },
    notes: {
      type: "text[]",
      notNull: false,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    deleted_at: {
      type: "timestamp",
      notNull: false,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("people");
  pgm.dropType("social_media_urls_type");
}
