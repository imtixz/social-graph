import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
