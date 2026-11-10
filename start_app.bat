@echo off
echo ========================================================
echo Starting Tiered Utility Tariff Arbitrage & Predictor App
echo ========================================================

set PYTHON_CMD=python
if exist ".venv\Scripts\python.exe" set PYTHON_CMD=.venv\Scripts\python.exe
if exist "backend\.venv\Scripts\python.exe" set PYTHON_CMD=backend\.venv\Scripts\python.exe

echo 1. Starting FastAPI Backend (reading from .env) ...
start "Backend (FastAPI)" cmd /k "%PYTHON_CMD% backend\main.py"

echo 2. Starting Next.js Frontend on http://localhost:3000 ...
start "Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers started in separate terminal windows!
echo - Web App: http://localhost:3000
echo - Swagger Docs: http://127.0.0.1:8000/docs
echo ========================================================
pause
