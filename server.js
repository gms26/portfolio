import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

import achievementsRoute from "./routes/achievements.js";
import authRoute from "./routes/auth.js";
import projectsRoute from "./routes/projects.js";
import resumeRoute from "./routes/resume.js";

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve uploads (images & PDFs)
app.use("/uploads", express.static("uploads"));

// Serve frontend
app.use(express.static("public"));

// API Routes
app.use("/api/achievements", achievementsRoute);
app.use("/api/login", authRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/resume", resumeRoute);  // ✅ Correct position

// Start server (must be last)
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
