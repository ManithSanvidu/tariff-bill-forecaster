@echo off
echo ========================================================
echo Starting Tiered Utility Tariff Arbitrage & Predictor App
echo ========================================================

echo 1. Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Backend (FastAPI)" cmd /k "cd backend && ..\.venv\Scripts\python.exe -m uvicorn app.api.routes:app --host 127.0.0.1 --port 8000 --reload"

echo 2. Starting Next.js Frontend on http://localhost:3000 ...
start "Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers started in separate terminal windows!
echo - Web App: http://localhost:3000
echo - Swagger Docs: http://127.0.0.1:8000/docs
echo ========================================================
pause
