# ==============================================================================
# Quantum Quest: The Quantum Circuit Adventure — QExpo 2026
# Multi-stage Production Dockerfile: Serves React Frontend + FastAPI Backend + DB
# ==============================================================================

# Stage 1: Build the React 18 / Vite 5 Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Python 3.12 Backend with Qiskit 1.4+, Aer & SQLAlchemy
FROM python:3.12-slim

# System dependencies for Qiskit C++ extensions & SQLite
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/
COPY pytest.ini ./

# Copy built frontend assets from Stage 1 into the location mounted by FastAPI
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ensure persistent data directory exists
RUN mkdir -p /app/backend/data

# Environment configuration
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PORT=8000 \
    DATABASE_URL=sqlite:////app/backend/data/quantum_quest.db

EXPOSE 8000

# Start production server with uvicorn
CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT}"]
