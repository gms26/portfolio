import express from "express";
import multer from "multer";
import Project from "../models/Project.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------- MULTER STORAGE + FILTER -------- */

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images or PDFs allowed"));
    }
  }
});

/* -------- GET (PUBLIC) -------- */
router.get("/", async (req, res) => {
  const items = await Project.find().sort({ _id: -1 });
  res.json(items);
});

/* -------- CREATE -------- */
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  const saved = await Project.create({
    title: req.body.title,
    description: req.body.description,
    tech: req.body.tech.split(",").map(t => t.trim()),
    github: req.body.github,
    live: req.body.live,

    imageUrl: req.file && req.file.mimetype.startsWith("image/")
      ? "/uploads/" + req.file.filename
      : "",

    pdfUrl: req.file && req.file.mimetype === "application/pdf"
      ? "/uploads/" + req.file.filename
      : ""
  });

  res.json(saved);
});

/* -------- UPDATE -------- */
router.put("/:id", verifyToken, upload.single("file"), async (req, res) => {
  const updateData = {
    title: req.body.title,
    description: req.body.description,
    tech: req.body.tech.split(",").map(t => t.trim()),
    github: req.body.github,
    live: req.body.live
  };

  if (req.file) {
    if (req.file.mimetype.startsWith("image/")) {
      updateData.imageUrl = "/uploads/" + req.file.filename;
    }
    if (req.file.mimetype === "application/pdf") {
      updateData.pdfUrl = "/uploads/" + req.file.filename;
    }
  }

  const updated = await Project.findByIdAndUpdate(req.params.id, updateData, {
    new: true
  });

  res.json(updated);
});

/* -------- DELETE -------- */
router.delete("/:id", verifyToken, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
