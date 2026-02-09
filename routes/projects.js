import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
            // Add fl_attachment flag for raw files (PDFs, docs) to enable download
            if (result.resource_type === 'raw') {
              fileUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');
            } else {
              fileUrl = result.secure_url;
            }
            resolve();
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const { title, description, techStack, link } = req.body;

    const project = await Project.create({
      title,
      description,
      techStack,
      link,
      fileUrl
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  const list = await Project.find().sort({ createdAt: -1 });
  res.json(list);
});

// Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
