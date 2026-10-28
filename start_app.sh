#!/usr/bin/env bash
echo "Starting Tiered Utility Tariff Arbitrage & Predictor App..."
trap 'kill $(jobs -p)' EXIT

cd backend && ../.venv/bin/uvicorn app.api.routes:app --host 127.0.0.1 --port 8000 --reload &
cd frontend && npm run dev &

wait
