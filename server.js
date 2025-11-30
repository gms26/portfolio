import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import achievementsRoute from "./routes/achievements.js";
import projectsRoute from "./routes/projects.js";
import authRoute from "./routes/auth.js";
import resumeRoute from "./routes/resume.js";

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/achievements", achievementsRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/login", authRoute);
app.use("/api/resume", resumeRoute);

// Fallback: serve index.html for unknown frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
