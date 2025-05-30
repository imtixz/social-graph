import type { Express } from "express";
import { db } from "../kysely";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../env";

export const registerInteractionRoutes = (app: Express) => {
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

      //   SELECT
      //     interactions.id,
      //     interactions.description,
      //     interactions.date,
      //     interactions.contact_id,
      //     contacts.name
      //   FROM interactions
      //   LEFT JOIN contacts ON interactions.contact_id = contacts.id
      //   WHERE user_id = ${userId}
      //   ORDER BY interactions.date DESC
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

      // SELECT * FROM interactions WHERE contact_id=${contactId}
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

      // INSERT INTO interactions (contact_id, description, date) VALUES (${contact_id}, '${description}', ${date})
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

      // DELETE FROM interactions WHERE id=${interactionId}
      await db
        .deleteFrom("interactions")
        .where("id", "=", Number(interactionId))
        .executeTakeFirst();

      // SELECT
      //   interactions.id,
      //   interactions.description,
      //   interactions.date,
      //   interactions.contact_id,
      //   contacts.name
      // FROM interactions
      // LEFT JOIN contacts ON interactions.contact_id = contacts.id
      // WHERE user_id = ${userId}
      // ORDER BY interactions.date DESC;
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

        // DELETE FROM interactions WHERE id=${interactionId};
        await db
          .deleteFrom("interactions")
          .where("id", "=", Number(interactionId))
          .executeTakeFirst();

        // SELECT * FROM interactions WHERE contact_id=${contactId};
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
    }
  );
};
