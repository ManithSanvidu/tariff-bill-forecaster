# Tiered Utility Tariff Arbitrage & Disaggregation Predictor

A mobile-friendly web application for Sri Lankan households that predicts end-of-month electricity and domestic water bills from sparse manual meter readings, and alerts users before they cross costly tariff slab boundaries (**Anti-Slab Alert**).

## Core Design Principle
> **The Machine Learning models ONLY predict consumption (units in kWh or m³). A separate, deterministic, config-driven tariff engine maps units into Sri Lankan Rupees (LKR). ML is never trained to predict the bill directly.**

---

## Architecture & Monorepo Structure

```
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI routes
│   │   ├── db/              # SQLAlchemy models & database session
│   │   ├── ml/              # Scikit-learn regressors & baseline models
│   │   ├── services/        # Open-Meteo client, data cleaner, alert engine
│   │   └── tariff_engine/   # Pure Python deterministic tariff engine
│   ├── tariffs/             # Versioned JSON tariff schedules (CEB, Water)
│   ├── alembic/             # Database migrations
│   └── tests/               # pytest test suite
├── frontend/                # Next.js App Router (TypeScript + Tailwind CSS + Recharts)
├── data/                    # Synthetic benchmarks & cached weather data
├── docs/                    # Architecture documentation & evaluation reports
└── docker-compose.yml       # Local PostgreSQL container configuration
```

---

## Quick Start (Run the Entire Application)

### Option A: One-Click Launch (Windows)
Double-click `start_app.bat` in the root folder, or run:
```cmd
start_app.bat
```
This automatically launches both:
- **Backend API**: `http://127.0.0.1:8000` (Docs at `http://127.0.0.1:8000/docs`)
- **Frontend App**: `http://localhost:3000`

---

### Option B: Manual Terminal Execution

#### 1. Start the FastAPI Backend
```bash
# In terminal 1:
.venv\Scripts\python.exe -m uvicorn app.api.routes:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

#### 2. Start the Next.js Frontend
```bash
# In terminal 2:
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Running the Test Suite
```bash
.venv\Scripts\python.exe -m pytest backend/tests -v
```
All 18 tests cover tariff boundary calculations, OCR confirmation enforcement, ML alerts, and DB schema.
