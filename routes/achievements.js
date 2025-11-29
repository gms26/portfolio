import express from "express";
import multer from "multer";
import Achievement from "../models/Achievement.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------- MULTER STORAGE + PDF/IMAGE FILTER --------- */

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

/* ---------- GET ALL (PUBLIC) --------- */
router.get("/", async (req, res) => {
  const items = await Achievement.find().sort({ _id: -1 });
  res.json(items);
});

/* ---------- CREATE --------- */
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  const newItem = {
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    type: req.body.type,
    skills: req.body.skills.split(",").map(s => s.trim()),

    imageUrl: req.file && req.file.mimetype.startsWith("image/")
      ? "/uploads/" + req.file.filename
      : "",

    pdfUrl: req.file && req.file.mimetype === "application/pdf"
      ? "/uploads/" + req.file.filename
      : ""
  };

  const saved = await Achievement.create(newItem);
  res.json(saved);
});

/* ---------- UPDATE --------- */
router.put("/:id", verifyToken, upload.single("file"), async (req, res) => {
  const updateData = {
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    type: req.body.type,
    skills: req.body.skills.split(",").map(s => s.trim())
  };

  if (req.file) {
    if (req.file.mimetype.startsWith("image/")) {
      updateData.imageUrl = "/uploads/" + req.file.filename;
    }
    if (req.file.mimetype === "application/pdf") {
      updateData.pdfUrl = "/uploads/" + req.file.filename;
    }
  }

  const updated = await Achievement.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(updated);
});

/* ---------- DELETE --------- */
router.delete("/:id", verifyToken, async (req, res) => {
  await Achievement.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
