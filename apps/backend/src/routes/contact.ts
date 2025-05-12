import type { Express } from "express";
import { db } from "../kysely";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../env";

export const registerContactRoutes = (app: Express) => {
  app.get("/api/contact", async (req, res) => {
    // throws 401 if user isnt logged in
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

      // SELECT * FROM contacts WHERE user_id=${userId};
      const contacts = await db
        .selectFrom("contacts")
        .selectAll()
        .where("user_id", "=", Number(userId))
        .execute();

      console.log(userId);
      res.json({
        contacts,
      });
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    console.log("entered the contract POST route");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
      const userId = decoded.id;

      console.log(userId, "<-- this is the userId");

      const {
        name,
        address,
        dateOfBirth,
        emailAddresses,
        phones,
        facebooks,
        instagrams,
        twitters,
        linkedins,
      }: {
        name: string;
        address: string;
        dateOfBirth: string;
        emailAddresses: string[];
        phones: string[];
        facebooks: string[];
        instagrams: string[];
        twitters: string[];
        linkedins: string[];
      } = req.body;

      console.log(req.body, "<--- this is req.body");
      console.log(new Date("07-14-03"), "<--- this is date of birth");

      // INSERT INTO contacts (name, address, date_of_birth, user_id)
      // VALUES ('${name}', '${address}', ${dateOfBirth}, ${userId})
      // RETURNING id;
      const contact = await db
        .insertInto("contacts")
        .values({
          name: name,
          address: address,
          date_of_birth: new Date(dateOfBirth),
          user_id: Number(userId),
        })
        .returning(["id"])
        .executeTakeFirst();

      if (!contact) throw new Error();

      if (emailAddresses?.length) {
        for (const email of emailAddresses) {
          // INSERT INTO contact_emails (email, contact_id)
          // VALUES ('${email}', ${contact.id});
          await db
            .insertInto("contact_emails")
            .values({
              email: email,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      if (phones?.length) {
        for (const phone of phones) {
          // INSERT INTO contact_phones (phone, contact_id)
          // VALUES ('${phone}', ${contact.id});
          await db
            .insertInto("contact_phones")
            .values({
              phone: phone,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      if (facebooks?.length) {
        for (const url of facebooks) {
          // INSERT INTO contact_socials (type, link, contact_id)
          // VALUES ('facebook', '${url}', ${contact.id});
          await db
            .insertInto("contact_socials")
            .values({
              type: "facebook",
              link: url,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      if (instagrams?.length) {
        for (const url of instagrams) {
          // INSERT INTO contact_socials (type, link, contact_id)
          // VALUES ('instagram', '${url}', ${contact.id});
          await db
            .insertInto("contact_socials")
            .values({
              type: "instagram",
              link: url,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      if (twitters?.length) {
        for (const url of twitters) {
          // INSERT INTO contact_socials (type, link, contact_id)
          // VALUES ('twitter', '${url}', ${contact.id});
          await db
            .insertInto("contact_socials")
            .values({
              type: "twitter",
              link: url,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      if (linkedins?.length) {
        for (const url of linkedins) {
          // INSERT INTO contact_socials (type, link, contact_id)
          // VALUES ('linkedin', '${url}', ${contact.id});
          await db
            .insertInto("contact_socials")
            .values({
              type: "linkedin",
              link: url,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      res.json({
        msg: "success!",
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({ error: err });
    }
  });

  app.get("/api/contact/:id", async (req, res) => {
    const authHeader = req.headers.authorization;

    const contactId = req.params.id;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
      const userId = decoded.id;

      if (!userId) throw new Error();

      // SELECT * FROM contacts WHERE id=${contactId} LIMIT 1;
      const contact = await db
        .selectFrom("contacts")
        .selectAll()
        .where("id", "=", Number(contactId))
        .executeTakeFirst();

      // SELECT * FROM conact_phones WHERE contact_id=${contactId}
      const phones = await db
        .selectFrom("contact_phones")
        .selectAll()
        .where("contact_id", "=", Number(contactId))
        .execute();

      // SELECT * FROM conact_emails WHERE contact_id=${contactId}
      const emailAddresses = await db
        .selectFrom("contact_emails")
        .selectAll()
        .where("contact_id", "=", Number(contactId))
        .execute();

      // SELECT * FROM conact_socials WHERE contact_id=${contactId}
      const socials = await db
        .selectFrom("contact_socials")
        .selectAll()
        .where("contact_id", "=", Number(contactId))
        .execute();

      res.json({
        contact,
        phones,
        emailAddresses,
        socials,
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({ error: "Failed to get contact's details" });
    }
  });

  app.post("/api/contact/:id", async (req, res) => {
    const authHeader = req.headers.authorization;

    const contactId = req.params.id;

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
        name,
        address,
        dateOfBirth,
        emailAddresses,
        phones,
        facebooks,
        instagrams,
        twitters,
        linkedins,
      }: {
        name: string;
        address: string;
        dateOfBirth: string;
        emailAddresses: string[];
        phones: string[];
        facebooks: string[];
        instagrams: string[];
        twitters: string[];
        linkedins: string[];
      } = req.body;

      // UPDATE contacts
      // SET name='${name}', address='${address}', date_of_birth=${dateOfBirth}, user_id=${userId}
      // WHERE id=${contactId}
      // RETURNING id;
      const contact = await db
        .updateTable("contacts")
        .where("id", "=", Number(contactId))
        .set({
          name: name,
          address: address,
          date_of_birth: new Date(dateOfBirth),
          user_id: Number(userId),
        })
        .returning(["id"])
        .executeTakeFirst();

      if (!contact) throw new Error();

      if (emailAddresses?.length) {
        // DELETE FROM contact_emails WHERE contact_id=${contactId}
        await db
          .deleteFrom("contact_emails")
          .where("contact_id", "=", Number(contactId))
          .executeTakeFirst();

        for (const email of emailAddresses) {
          // INSERT INTO contact_emails (email, contact_id)
          // VALUES ('${email}', ${contact.id});
          await db
            .insertInto("contact_emails")
            .values({
              email: email,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      if (phones?.length) {
        // DELETE FROM contact_phones WHERE contact_id=${contactId};
        await db
          .deleteFrom("contact_phones")
          .where("contact_id", "=", Number(contactId))
          .executeTakeFirst();

        for (const phone of phones) {
          // INSERT INTO contact_phones (phone, contact_id)
          // VALUES ('${phone}', ${contact.id});
          await db
            .insertInto("contact_phones")
            .values({
              phone: phone,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      await db
        // DELETE FROM contact_socials WHERE contact_id=${contactId};
        .deleteFrom("contact_socials")
        .where("contact_id", "=", Number(contactId))
        .executeTakeFirst();

      if (facebooks?.length) {
        for (const url of facebooks) {
          // INSERT INTO contact_socials (type, link, contact_id)
          // VALUES ('facebook', '${url}', ${contact.id});
          await db
            .insertInto("contact_socials")
            .values({
              type: "facebook",
              link: url,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      if (instagrams?.length) {
        for (const url of instagrams) {
          // INSERT INTO contact_socials (type, link, contact_id)
          // VALUES ('instagram', '${url}', ${contact.id});
          await db
            .insertInto("contact_socials")
            .values({
              type: "instagram",
              link: url,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      if (twitters?.length) {
        for (const url of twitters) {
          // INSERT INTO contact_socials (type, link, contact_id)
          // VALUES ('twitter', '${url}', ${contact.id});
          await db
            .insertInto("contact_socials")
            .values({
              type: "twitter",
              link: url,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      if (linkedins?.length) {
        for (const url of linkedins) {
          // INSERT INTO contact_socials (type, link, contact_id)
          // VALUES ('linkedin', '${url}', ${contact.id});
          await db
            .insertInto("contact_socials")
            .values({
              type: "linkedin",
              link: url,
              contact_id: contact.id,
            })
            .executeTakeFirst();
        }
      }

      console.log(userId);
      res.json({
        msg: "success!",
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.delete("/api/contact/:id", async (req, res) => {
    const authHeader = req.headers.authorization;

    const contactId = req.params.id;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
      const userId = decoded.id;

      if (!userId) throw new Error();

      // DELETE FROM contacts WHERE id=${contactId};
      await db
        .deleteFrom("contacts")
        .where("id", "=", Number(contactId))
        .executeTakeFirst();

      // SELECT * FROM contacts WHERE user_id=${userId}
      const contacts = await db
        .selectFrom("contacts")
        .selectAll()
        .where("user_id", "=", Number(userId))
        .execute();

      res.json({
        contacts,
      });
    } catch (err) {
      res.status(401).json({ error: "Failed to delete contact's information" });
    }
  });
};
