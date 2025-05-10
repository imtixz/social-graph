import express from "express";
import cors from "cors";
import { db } from "./kysely";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3000;
const SECRET_KEY = "super-secret";

// Middlewares
app.use(express.json());
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  if (!user) {
    res.status(404).json({ error: "User not found" });
  }

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  if (user?.password !== hash) {
    res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ id: user?.id }, SECRET_KEY, {
    expiresIn: "1d",
  });

  res.json({
    id: user?.id,
    email: user?.email,
    token,
  });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = crypto.createHash("sha256").update(password).digest("hex");

  const user = await db
    .insertInto("users")
    .values({
      name,
      email,
      password: hash,
    })
    .returning(["id", "email"])
    .executeTakeFirst();

  const token = jwt.sign({ id: user?.id }, SECRET_KEY, {
    expiresIn: "1d",
  });

  res.json({
    id: user?.id,
    email: user?.email,
    token,
  });
});

app.get("/api/profile", async (req, res) => {
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

    const user = await db
      .selectFrom("users")
      .select(["id", "email", "name"])
      .where("id", "=", Number(userId))
      .executeTakeFirst();

    res.json({
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Something went wront!" });
  }
});

app.post("/api/profile", async (req, res) => {
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

    const { name } = req.body;

    await db
      .updateTable("users")
      .set("name", name)
      .where("id", "=", Number(userId))
      .executeTakeFirst();

    res.json({
      msg: "Success!",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Something went wront!" });
  }
});

app.post("/api/profile/change-password", async (req, res) => {
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

    const { password } = req.body;
    const hash = crypto.createHash("sha256").update(password).digest("hex");

    await db
      .updateTable("users")
      .where("id", "=", Number(userId))
      .set({
        password: hash,
      })
      .executeTakeFirst();

    res.json({
      msg: "Success!",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Something went wront!" });
  }
});

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

    const contact = await db
      .selectFrom("contacts")
      .selectAll()
      .where("id", "=", Number(contactId))
      .executeTakeFirst();

    const phones = await db
      .selectFrom("contact_phones")
      .selectAll()
      .where("contact_id", "=", Number(contactId))
      .execute();

    const emailAddresses = await db
      .selectFrom("contact_emails")
      .selectAll()
      .where("contact_id", "=", Number(contactId))
      .execute();

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
      await db
        .deleteFrom("contact_emails")
        .where("contact_id", "=", Number(contactId))
        .executeTakeFirst();

      for (const email of emailAddresses) {
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
      await db
        .deleteFrom("contact_phones")
        .where("contact_id", "=", Number(contactId))
        .executeTakeFirst();

      for (const phone of phones) {
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
      .deleteFrom("contact_socials")
      .where("contact_id", "=", Number(contactId))
      .executeTakeFirst();

    if (facebooks?.length) {
      for (const url of facebooks) {
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

    await db
      .deleteFrom("contacts")
      .where("id", "=", Number(contactId))
      .executeTakeFirst();

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

app.get("/api/interactions", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    const userId = decoded.id;

    // route logic here
    const interactions = await db
      .selectFrom("interactions")
      .leftJoin("contacts", "interactions.contact_id", "contacts.id")
      .select([
        "interactions.id",
        "interactions.description",
        "interactions.date",
        "interactions.contact_id",
        "contacts.name",
      ])
      .where("user_id", "=", Number(userId))
      .orderBy("interactions.date", "desc")
      .execute();

    res.json({
      interactions,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "something went wrong!",
    });
  }
});

app.get("/api/contact/:id/interactions", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    const userId = decoded.id;
    const contactId = req.params.id;

    // route logic here
    const interactions = await db
      .selectFrom("interactions")
      .selectAll()
      .where("contact_id", "=", Number(contactId))
      .execute();

    res.json({
      interactions,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "something went wrong!",
    });
  }
});

app.post("/api/contact/interaction/add", async (req, res) => {
  console.log("ENTERED API CONTACT INTERACTION");
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { contactId, description, date } = req.body;
  console.log(req.body);

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    console.log(contactId, description, date);

    await db
      .insertInto("interactions")
      .values({
        contact_id: contactId,
        description: description,
        date: date,
      })
      .executeTakeFirst();

    res.json({
      msg: "success!",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "something went wrong!",
    });
  }
});

app.delete("/api/contact/interaction/:interactionId", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    const userId = decoded.id;
    const interactionId = req.params.interactionId;

    await db
      .deleteFrom("interactions")
      .where("id", "=", Number(interactionId))
      .executeTakeFirst();

    const interactions = await db
      .selectFrom("interactions")
      .leftJoin("contacts", "interactions.contact_id", "contacts.id")
      .select([
        "interactions.id",
        "interactions.description",
        "interactions.date",
        "interactions.contact_id",
        "contacts.name",
      ])
      .where("user_id", "=", Number(userId))
      .orderBy("interactions.date", "desc")
      .execute();

    res.json({
      interactions,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "something went wrong!",
    });
  }
});

app.delete(
  "/api/contact/:contactId/interaction/:interactionId",
  async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
      const userId = decoded.id;

      const contactId = req.params.contactId;
      const interactionId = req.params.interactionId;

      await db
        .deleteFrom("interactions")
        .where("id", "=", Number(interactionId))
        .executeTakeFirst();

      const interactions = await db
        .selectFrom("interactions")
        .where("contact_id", "=", Number(contactId))
        .execute();

      res.json({
        interactions,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: "something went wrong!",
      });
    }
  }
);

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

    // gets all the reminders that are
    const reminders = await db
      .selectFrom("reminders")
      .selectAll()
      .where("user_id", "=", Number(userId))
      .execute();

    const contactsInReminders = await db
      .selectFrom("contacts")
      .leftJoin(
        "contacts_in_reminder",
        "contacts_in_reminder.contact_id",
        "contacts.id"
      )
      .leftJoin("reminders", "reminders.id", "contacts_in_reminder.reminder_id")
      .where("reminders.user_id", "=", Number(userId))
      .select([
        "contacts.id as contactId",
        "contacts.name",
        "reminders.id as reminderId",
      ])
      .execute();

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
