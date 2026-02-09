import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Achievement from "../models/Achievement.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create achievement
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    let fileUrl = null;

    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            access_mode: "public"
          },
          (error, result) => {
            if (error) return reject(error);
            fileUrl = result.secure_url;
            resolve();
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const { title, description, type, date } = req.body;

    const achievement = await Achievement.create({
      title,
      description,
      type,
      date: date ? new Date(date) : new Date(),
      fileUrl
    });

    res.json(achievement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all achievements
router.get("/", async (req, res) => {
  const list = await Achievement.find().sort({ createdAt: -1 });
  res.json(list);
});

// Delete achievement
router.delete("/:id", authMiddleware, async (req, res) => {
  await Achievement.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
