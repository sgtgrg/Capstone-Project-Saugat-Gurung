# Cognitive Stress Tracker

A privacy-first web application that combines validated **self-assessment** (the
Perceived Stress Scale, PSS-10) with contactless **remote photoplethysmography
(rPPG)** heart-rate sensing to help users monitor their cognitive stress
patterns — without expensive wearables. All webcam video is processed **locally
in the browser**; only aggregated heart-rate / HRV metrics are stored.

Capstone project — Master of Software Engineering. Built by Saugat Gurung.

## Tech stack

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| Frontend  | React 18 (Vite), Tailwind CSS, Chart.js      |
| Backend   | Python, Flask (REST API, Blueprints)         |
| Database  | MongoDB (PyMongo)                            |
| rPPG      | In-browser JavaScript, CHROM method          |
| Auth      | JWT + bcrypt                                 |

## Project structure

```
Capstone Project/
├── backend/            Flask REST API
│   ├── app/
│   │   ├── routes/     Blueprints: health, auth, assessments, physiological
│   │   ├── models/     MongoDB document models
│   │   └── utils/      Helpers (auth, etc.)
│   ├── config.py
│   ├── run.py          Start the API:  python run.py
│   └── requirements.txt
├── frontend/           React + Vite single-page app
│   └── src/
│       ├── pages/      Home, Assessment, Measure, Dashboard
│       ├── components/ Navbar, etc.
│       └── api/        Axios client
├── PROJECT_PLAN.md     Day-by-day build plan (Jun 15 → Jul 10)
├── SETUP_WINDOWS.md    Beginner setup guide (install + run + push to GitHub)
└── README.md
```

## Quick start

See **SETUP_WINDOWS.md** for full, beginner-friendly instructions. In short:

```bash
# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env        # then edit .env
python run.py                 # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
copy .env.example .env
npm run dev                   # http://localhost:5173
```

## Privacy

Raw webcam video never leaves the device. rPPG runs entirely in the browser
(CHROM method); only computed heart-rate and HRV values are sent to the API.
