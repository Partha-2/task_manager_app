import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
