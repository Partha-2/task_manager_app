import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { generateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)").run(email, hashed, name);

  const token = generateToken(result.lastInsertRowid);
  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, email, name },
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken(user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

router.get("/me", (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    const payload = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET || "change-me-in-production");
    const user = db.prepare("SELECT id, email, name FROM users WHERE id = ?").get(payload.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
