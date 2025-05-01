import express from "express";
import cors from "cors";
import { db } from "./kysely";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3000;

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

  const token = jwt.sign({ id: user?.id }, "your-secret-key", {
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

app.get("/api/contact", (req, res) => {
  // throws 401 if user isnt logged in
  // gets all contact
});

app.post("/api/contact", (req, res) => {
  // creates a new contact here
});

app.get("/api/contact/:id", (req, res) => {
  // gets all details for a particular contact
});

app.patch("/api/contact/:id", (req, res) => {
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
