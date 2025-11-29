import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

let storedResume = null;

// ======================================================
// Ensure uploads folder exists
// ======================================================
if (!fs.existsSync("./uploads")) {
  console.log("📁 uploads/ folder missing → Creating it...");
  fs.mkdirSync("./uploads");
}

// ======================================================
// Multer Storage Engine
// ======================================================
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    console.log("📁 Saving file:", file.originalname);
    const finalName = "resume-" + Date.now() + ".pdf";
    storedResume = finalName;
    cb(null, finalName);
  }
});

// ======================================================
// Multer: PDF ONLY
// ======================================================
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log("🔍 File mimetype:", file.mimetype);
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      console.log("❌ Rejecting file → not PDF");
      cb(new Error("Only PDF allowed"));
    }
  }
});

// ======================================================
// POST — Upload Resume
// ======================================================
router.post("/", upload.single("resumeFile"), (req, res) => {
  console.log("📥 FILE RECEIVED:", req.file);
  console.log("💾 storedResume:", storedResume);

  if (!req.file) {
    console.log("❌ No file received");
    return res.json({ resumeUrl: null });
  }

  return res.json({ resumeUrl: "/uploads/" + storedResume });
});

// ======================================================
// GET — Get Resume URL
// ======================================================
router.get("/", (req, res) => {
  console.log("🔎 GET resume:", storedResume);

  if (!storedResume) {
    return res.json({ resumeUrl: null });
  }

  return res.json({ resumeUrl: "/uploads/" + storedResume });
});

// ======================================================
// DELETE — Remove Resume File
// ======================================================
router.delete("/", (req, res) => {
  console.log("🗑 Delete request for resume:", storedResume);

  if (!storedResume) {
    return res.json({ message: "No resume found" });
  }

  const filePath = "./uploads/" + storedResume;

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("🗑 Deleted file:", filePath);
  } else {
    console.log("⚠ File not found in uploads folder");
  }

  storedResume = null;

  return res.json({ message: "Resume deleted" });
});

export default router;
