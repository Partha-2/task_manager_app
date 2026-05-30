import { Router } from "express";
import db from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC").all(req.userId);
  res.json({ tasks });
});

router.post("/", (req, res) => {
  const { title, description, stage } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const validStage = ["todo", "in_progress", "done"].includes(stage) ? stage : "todo";
  const result = db
    .prepare("INSERT INTO tasks (user_id, title, description, stage) VALUES (?, ?, ?, ?)")
    .run(req.userId, title.trim(), description || "", validStage);
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ task });
});

router.put("/:id", (req, res) => {
  const { title, description, stage } = req.body;
  const existing = db.prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?").get(req.params.id, req.userId);
  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }
  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ error: "Title cannot be empty" });
  }
  const validStage = stage && ["todo", "in_progress", "done"].includes(stage) ? stage : existing.stage;
  db.prepare(
    "UPDATE tasks SET title = ?, description = ?, stage = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?"
  ).run(title || existing.title, description !== undefined ? description : existing.description, validStage, req.params.id, req.userId);
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
  res.json({ task });
});

router.delete("/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?").get(req.params.id, req.userId);
  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }
  db.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
  res.json({ message: "Task deleted" });
});

export default router;
