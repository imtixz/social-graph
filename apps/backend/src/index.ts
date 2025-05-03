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

  res.json({
    id: user?.id,
    email: user?.email,
  });
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

    // You can now use userId for further processing
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
      phoneNumbers,
      facebooks,
      instagrams,
      twitters,
      linkedins,
    }: {
      name: string;
      address: string;
      dateOfBirth: string;
      emailAddresses: string[];
      phoneNumbers: string[];
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

    if (emailAddresses.length) {
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

    if (phoneNumbers.length) {
      for (const phone of phoneNumbers) {
        await db
          .insertInto("contact_phones")
          .values({
            phone: phone,
            contact_id: contact.id,
          })
          .executeTakeFirst();
      }
    }

    if (facebooks.length) {
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

    if (instagrams.length) {
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

    if (twitters.length) {
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

    if (linkedins.length) {
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

app.get("/api/contact/:id", (req, res) => {
  // gets all details for a particular contact
});

app.post("/api/contact/:id", (req, res) => {
  // updates a detail about the contact
});

app.delete("/api/contact:id", (req, res) => {
  // deletes a contact
});

app.post("/api/contact/notes", (req, res) => {
  // creates a contact against a user
});

app.delete("/api/contact/notes", (req, res) => {
  // deletes note against a contact
});

app.post("/api/contact/interaction", (req, res) => {
  // logs an interaction with a contact
});

app.delete("/api/contact/interaction", (req, res) => {
  // deletes an interaction with a contact
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
