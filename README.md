# Task Manager

A simple three-stage (Todo → In Progress → Done) task manager with authentication.

**Live Demo:** [Add your deployed URL here]

## Tech Stack

- **Frontend:** React 18, React Router v6, Tailwind CSS, Vite
- **Backend:** Node.js, Express, better-sqlite3, JWT (bcryptjs + jsonwebtoken)

## Features

- User registration & login with JWT
- Create, edit, delete tasks
- Drag-free stage transitions via buttons (Todo → In Progress → Done)
- Tasks persist per user
- Responsive 3-column board layout
- Loading and error states throughout

## Local Development

```bash
# Backend
cd backend
npm install
npm run dev    # starts on :3001

# Frontend (separate terminal)
cd frontend
npm install
npm run dev    # starts on :5173, proxies /api to :3001
```

## Deployment

### Frontend
Deploy `frontend/dist` to any static host (Vercel, Netlify, Cloudflare Pages, etc.).
Set the Vite proxy or directly configure `VITE_API_URL` to point at the live backend.

### Backend
Deploy the `backend/` directory to a Node.js host (Render, Railway, Fly.io, etc.).
Set `JWT_SECRET` and `PORT` environment variables as needed.

## Assumptions & Tradeoffs

- **SQLite** was chosen over PostgreSQL for zero-config local setup. It is sufficient for a single-server deployment but does not scale horizontally.
- **Board-style layout** (3 columns) instead of a list — more visual and closer to real PM tools.
- **Stage buttons** instead of drag-and-drop to keep the implementation simple and touch-friendly without extra dependencies.
- **JWT stored in localStorage** — simple for this scope. A production app would use httpOnly cookies to mitigate XSS risk.
- **No pagination** — tasks per user are assumed to be manageable (< 1000).
- **No tests** — omitted for time; the API surface is small and was verified manually.
- **`better-sqlite3`** is used because it is synchronous and simpler than `sql.js` or async drivers. It requires native compilation, so the deployment platform must support it.

## API Endpoints

| Method | Path             | Auth | Description          |
|--------|------------------|------|----------------------|
| POST   | /api/auth/register | No   | Register a new user |
| POST   | /api/auth/login    | No   | Login               |
| GET    | /api/auth/me       | Yes  | Get current user    |
| GET    | /api/tasks         | Yes  | List user's tasks   |
| POST   | /api/tasks         | Yes  | Create a task       |
| PUT    | /api/tasks/:id     | Yes  | Update a task       |
| DELETE | /api/tasks/:id     | Yes  | Delete a task       |
