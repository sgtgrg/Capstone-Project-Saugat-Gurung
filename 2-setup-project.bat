@echo off
setlocal
title Cognitive Stress Tracker - Step 2: Set up project
cd /d "%~dp0"

echo ==================================================
echo   Cognitive Stress Tracker  -  STEP 2
echo   Setting up the project (one time only)
echo ==================================================
echo.

REM --- Check Python is available ---
where python >nul 2>nul
if errorlevel 1 (
  echo [PROBLEM] Python was not found.
  echo Did you restart your computer after Step 1? Please restart, then run this again.
  echo.
  pause
  exit /b 1
)

echo [1/5] Creating Python virtual environment...
cd backend
python -m venv .venv
if errorlevel 1 (
  echo [PROBLEM] Could not create the environment. Make sure Step 1 finished and you restarted.
  pause
  exit /b 1
)

echo [2/5] Upgrading pip...
.venv\Scripts\python.exe -m pip install --upgrade pip

echo [3/5] Installing backend dependencies...
.venv\Scripts\python.exe -m pip install -r requirements.txt
if errorlevel 1 (
  echo [PROBLEM] Backend dependencies failed to install.
  pause
  exit /b 1
)

echo [4/5] Creating backend .env file...
if not exist .env copy .env.example .env

cd ..
echo [5/5] Installing frontend dependencies (this can take a few minutes)...
cd frontend
call npm install
if errorlevel 1 (
  echo [PROBLEM] Frontend dependencies failed. Did you restart after installing Node?
  pause
  exit /b 1
)
if not exist .env copy .env.example .env
cd ..

echo.
echo ==================================================
echo   STEP 2 DONE!
echo.
echo   To run the app, double-click:  start-app.bat
echo ==================================================
echo.
pause
