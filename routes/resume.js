import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Resume from "../models/Resume.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload resume (PDF)
router.post("/", authMiddleware, upload.single("resumeFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let url = null;

    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "resumes" },
        async (error, result) => {
          if (error) return reject(error);
          url = result.secure_url;
          resolve();
        }
      );
      stream.end(req.file.buffer);
    });

    // Remove old resumes
    await Resume.deleteMany({});
    const newResume = await Resume.create({ resumeUrl: url });

    res.json({ resumeUrl: newResume.resumeUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get resume
router.get("/", async (req, res) => {
  const resume = await Resume.findOne();
  if (!resume) return res.json({ resumeUrl: null });
  res.json({ resumeUrl: resume.resumeUrl });
});

// Delete resume
router.delete("/", authMiddleware, async (req, res) => {
  await Resume.deleteMany({});
  res.json({ message: "Resume deleted" });
});

export default router;
