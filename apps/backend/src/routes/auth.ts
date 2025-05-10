import type { Express } from "express";
import { db } from "../kysely";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../env";

export const registerAuthRotues = (app: Express) => {
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
};
