import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Change these to your own credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

router.post("/", (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({ token });
});

export default router;
