import type { Express } from "express";
import { db } from "../kysely";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../env";

export const registerReminderRoutes = (app: Express) => {
  app.get("/api/reminders", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
      const userId = decoded.id;

      if (!userId) throw new Error();

      // SELECT * FROM reminders WHERE user_id=${userId};
      const reminders = await db
        .selectFrom("reminders")
        .selectAll()
        .where("user_id", "=", Number(userId))
        .execute();

      // SELECT contacts.id AS contactId, contacts.name, reminders.id AS reminderId
      // FROM contacts
      // LEFT JOIN contacts_in_reminder ON contacts_in_reminder.contact_id = contacts.id
      // LEFT JOIN reminders ON reminders.id = contacts_in_reminder.reminder_id
      // WHERE reminders.user_id = ${userId};
      const contactsInReminders = await db
        .selectFrom("contacts")
        .leftJoin(
          "contacts_in_reminder",
          "contacts_in_reminder.contact_id",
          "contacts.id"
        )
        .leftJoin(
          "reminders",
          "reminders.id",
          "contacts_in_reminder.reminder_id"
        )
        .where("reminders.user_id", "=", Number(userId))
        .select([
          "contacts.id as contactId",
          "contacts.name",
          "reminders.id as reminderId",
        ])
        .execute();

      // SELECT * FROM contacts WHERE user_id=${userId};
      const contacts = await db
        .selectFrom("contacts")
        .selectAll()
        .where("contacts.user_id", "=", Number(userId))
        .execute();

      const birthdayReminders = contacts.map((contact) => {
        const currentYear = new Date().getFullYear();
        const birthDate = new Date(contact.date_of_birth!);
        const nextBirthday = new Date(
          currentYear,
          birthDate.getMonth(),
          birthDate.getDate()
        );

        if (nextBirthday < new Date()) {
          nextBirthday.setFullYear(currentYear + 1);
        }

        return {
          ...contact,
          title: `${contact.name}'s Birthday!`,
          body: `Don't forget to wish ${contact.name} for their birthday! If possible, get a gift as well!`,
          remind_on: nextBirthday,
        };
      });

      res.json({
        reminders,
        birthdayReminders,
        contactsInReminders,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: "Failed to create reminder",
      });
    }
  });

  app.post("/api/reminder", async (req, res) => {
    // creates a new reminder
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
      const userId = decoded.id;

      if (!userId) throw new Error();

      const {
        relevantContacts,
        title,
        body,
        date,
      }: {
        relevantContacts: string[];
        title: string;
        body: string;
        date: string;
      } = req.body;

      // INSERT INTO reminders (user_id, title, body, remind_on)
      // VALUES (${(userId)}, '${title}', '${body}', ${date})
      // RETURNING id;
      const reminder = await db
        .insertInto("reminders")
        .values({
          user_id: Number(userId),
          title: title,
          body: body,
          remind_on: date,
        })
        .returning(["id"])
        .executeTakeFirst();

      for (const contactId of relevantContacts) {
        // INSERT INTO contacts_in_reminder (reminder_id, contact_id)
        // VALUES (${reminder.id}, ${contactId});
        await db
          .insertInto("contacts_in_reminder")
          .values({
            reminder_id: reminder!.id,
            contact_id: Number(contactId),
          })
          .executeTakeFirst();
      }

      res.json({
        msg: "Reminder created successfully!",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: "Failed to create reminder",
      });
    }
  });
};
