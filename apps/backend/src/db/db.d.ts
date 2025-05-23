/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type SocialType = "facebook" | "instagram" | "linkedin" | "twitter";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface ContactEmails {
  contact_id: number;
  email: string;
}

export interface ContactNotes {
  body: string;
  contact_id: number;
  id: Generated<number>;
  title: string;
}

export interface ContactPhones {
  contact_id: number;
  phone: string;
}

export interface Contacts {
  address: string;
  date_of_birth: Timestamp | null;
  id: Generated<number>;
  name: string;
  user_id: number;
}

export interface ContactsInGroups {
  contact_id: number;
  group_id: number;
}

export interface ContactsInReminder {
  contact_id: number;
  reminder_id: number;
}

export interface ContactSocials {
  contact_id: number;
  link: string;
  type: SocialType;
}

export interface Groups {
  description: string;
  id: Generated<number>;
  name: string;
  user_id: number;
}

export interface Interactions {
  contact_id: number;
  date: Timestamp;
  description: string;
  id: Generated<number>;
}

export interface Pgmigrations {
  id: Generated<number>;
  name: string;
  run_on: Timestamp;
}

export interface Reminders {
  body: string;
  id: Generated<number>;
  remind_on: Timestamp | null;
  title: string;
  user_id: number;
}

export interface Users {
  email: string;
  id: Generated<number>;
  name: string;
  password: string | null;
}

export interface DB {
  contact_emails: ContactEmails;
  contact_notes: ContactNotes;
  contact_phones: ContactPhones;
  contact_socials: ContactSocials;
  contacts: Contacts;
  contacts_in_groups: ContactsInGroups;
  contacts_in_reminder: ContactsInReminder;
  groups: Groups;
  interactions: Interactions;
  pgmigrations: Pgmigrations;
  reminders: Reminders;
  users: Users;
}
