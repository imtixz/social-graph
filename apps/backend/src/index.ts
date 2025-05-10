import express from "express";
import cors from "cors";
import { registerAuthRotues } from "./routes/auth";
import { registerProfileRoutes } from "./routes/profile";
import { registerContactRoutes } from "./routes/contact";
import { registerInteractionRoutes } from "./routes/interaction";
import { registerReminderRoutes } from "./routes/reminder";

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

registerAuthRotues(app);
registerProfileRoutes(app);
registerContactRoutes(app);
registerInteractionRoutes(app);
registerReminderRoutes(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
