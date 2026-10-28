# 🚀 Quantum Quest: Production Deployment Guide

This guide explains how to deploy **Quantum Quest: The Quantum Circuit Adventure** (React 18 + FastAPI + Qiskit Aer + Database) to production for **QExpo 2026**.

---

## 🗄️ Database Architecture

The backend now uses **SQLAlchemy ORM** with automatic database persistence:
- **Default (Zero-Config)**: Embedded SQLite at `backend/data/quantum_quest.db`.
- **Production PostgreSQL**: If you provide a `DATABASE_URL` environment variable (e.g. from Supabase, Neon, Railway, or Render Postgres), the application automatically connects to PostgreSQL!
- **Persistent Tables**:
  - `students`: Stores all registered students, schools, quantum avatars, cumulative XP points, achievement tiers, streaks, and completed level IDs (`[1, 2, 3, ...]`).
  - Progress is saved directly to the database via `POST /api/student/save` and retrieved via `GET /api/student/{name}`.

---

## 🌐 Deployment Options

### Option 1: 1-Click Render Deployment (Recommended & Free Tier)

The repository includes a production [`render.yaml`](file:///Users/anjalisimmalapudi/Desktop/quantum-playground/render.yaml) blueprint and [`.dockerignore`](file:///Users/anjalisimmalapudi/Desktop/quantum-playground/.dockerignore) for zero-config Render deployments:

1. Push this repository to **GitHub** (already synchronized with `main`).
2. Go to [Render.com](https://render.com) and click **New > Blueprint** (or **New > Web Service**).
3. Select your GitHub repository (`quantum-playground`).
4. If using **Blueprint**, Render automatically configures the Docker environment, health check at `/api/health`, and port routing from `render.yaml`.
   - If using **Web Service**, set:
     - **Environment**: `Docker`
     - **Branch**: `main`
     - **Health Check Path**: `/api/health`
     - **Plan**: Free
5. Render will automatically build the multi-stage `Dockerfile`, start the server on `$PORT`, and serve both the React frontend and FastAPI backend with SQLite persistence!
6. *(Optional)* Add a free **Render PostgreSQL** database:
   - Create a PostgreSQL database on Render.
   - Copy the **Internal Database URL** and set it as `DATABASE_URL` in your Web Service environment variables.

---

### Option 2: Railway Deployment (Ultra-Fast)

1. Go to [Railway.app](https://railway.app).
2. Click **New Project > Deploy from GitHub repo**.
3. Select this repository.
4. Railway will automatically detect the `Dockerfile` and build it.
5. In your Railway service settings:
   - Under **Variables**, add:
     - `PORT` = `8000`
   - *(Optional)* Click **+ New > Database > PostgreSQL** to attach a persistent PostgreSQL database with one click.
6. Generate a public domain under **Networking**.

---

### Option 3: Docker / Self-Hosted VPS Deployment

To run the application locally or on an Ubuntu/Debian/AWS EC2 VPS:

```bash
# 1. Clone repository
git clone <your-repo-url>
cd quantum-playground

# 2. Build and start with Docker Compose (includes persistent volume)
docker compose up --build -d

# 3. Check logs
docker compose logs -f
```

The application will be live at `http://localhost:8000` with the database stored in the `quantum_db_data` volume.

---

---

### Option 4: Netlify Deployment (Frontend Only or Split Architecture)

> **Important**: Netlify is a static web and serverless host. It **cannot** run persistent Python servers (`uvicorn`), C++ compiled libraries (`qiskit-aer`), or persistent SQLite files.

You have two choices if deploying to **Netlify**:

#### Choice A: Full-Stack (Netlify UI + Free Render/Railway Python Backend) — Recommended for Netlify
1. Deploy the backend to **Render** or **Railway** using the provided `Dockerfile`.
2. Get your backend URL (e.g. `https://quantum-quest-backend.onrender.com`).
3. Connect your GitHub repository to **Netlify**:
   - The repository includes [`netlify.toml`](file:///Users/anjalisimmalapudi/Desktop/quantum-playground/netlify.toml), so Netlify will automatically detect:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
4. In Netlify Site Settings > **Environment variables**, set:
   - `VITE_API_URL` = `https://quantum-quest-backend.onrender.com`
5. Deploy! The React UI is delivered via Netlify CDN and automatically communicates with the cloud backend for database saves and Qiskit simulation.

#### Choice B: Standalone Static Netlify (Zero Backend)
1. Simply connect this repository to **Netlify** and click **Deploy**.
2. Netlify will build the frontend cleanly using `netlify.toml`.
3. In this mode:
   - The interactive 3D Bloch sphere, Gate Lab, and circuit simulator run directly inside the browser using the built-in JavaScript quantum engine (`quantumEngine.js`).
   - Student session progress and leaderboard scores are stored locally in the student's browser `localStorage`.

---

### Option 5: Split Deployment (Frontend on Vercel + Backend on Render/Railway)

If you prefer hosting the React frontend on **Vercel** and the Python/Qiskit backend on **Render/Railway**:

1. **Deploy Backend**:
   - Deploy `backend/` to Render or Railway.
   - Note the backend URL: e.g. `https://quantum-quest-api.onrender.com`.

2. **Deploy Frontend to Vercel**:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment Variable: `VITE_API_URL` = `https://quantum-quest-api.onrender.com`

---

## 📡 Key Endpoints for Verification

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Health check, Qiskit & Aer engine status |
| `/api/leaderboard` | GET | Queries persistent database for current rankings |
| `/api/leaderboard/submit` | POST | Upserts student score and recalculates ranks |
| `/api/leaderboard/clear` | POST | Wipes all entries to a fresh slate for new expo day |
| `/api/leaderboard/reset` | POST | Restores benchmark scientific demo seeds |
| `/api/leaderboard/export` | GET | Downloads CSV export of all student rankings |
| `/api/student/{name}` | GET | Fetches student profile & saved missions from DB |
| `/api/student/save` | POST | Saves student level, XP & completed missions to DB |
