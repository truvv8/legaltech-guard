#!/bin/bash
set -e

echo "============================================"
echo "  FD Group — Investor Shield Platform"
echo "  Starting all services..."
echo "============================================"

# 1. Start infrastructure
echo "[1/4] Starting PostgreSQL + Redis + Ollama..."
docker compose up -d postgres redis ollama

# 2. Wait for DB
echo "[2/4] Waiting for database..."
sleep 5

# 3. Pull Llama 3.1 model (first run only)
echo "[3/4] Ensuring AI model is available..."
docker compose exec ollama ollama pull llama3.1
docker compose exec ollama ollama pull all-minilm

# 4. Run migrations and seed
echo "[4/4] Running migrations and seeding knowledge base..."
docker compose up -d backend
sleep 3
docker compose exec backend alembic upgrade head
docker compose exec backend python -m scripts.seed_knowledge

# 5. Start frontend
docker compose up -d frontend

echo ""
echo "============================================"
echo "  All services started!"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:8000/api/docs"
echo "  Ollama:    http://localhost:11434"
echo "============================================"
