import type { Express } from "express";
import { db } from "../kysely";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../env";

export const registerProfileRoutes = (app: Express) => {
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

      // SELECT id, email, name FROM users WHERE id=${userId} LIMIT 1;
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

      // UPDATE users SET name='${name}' WHERE id=${userId};
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

      // UPDATE users SET password='${hash}' WHERE id=${userId};
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
};
