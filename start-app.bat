@echo off
title Cognitive Stress Tracker - Launcher
cd /d "%~dp0"

echo ==================================================
echo   Starting the Cognitive Stress Tracker
echo ==================================================
echo.
echo Two windows will open (Backend and Frontend).
echo KEEP THEM OPEN while you use the app.
echo To stop the app later, just close those two windows.
echo.

REM --- Start the Flask backend in its own window ---
start "Stress Tracker - Backend" cmd /k "cd /d %~dp0backend && .venv\Scripts\python.exe run.py"

REM --- Start the React frontend in its own window ---
start "Stress Tracker - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Waiting ~12 seconds for the servers to warm up...
timeout /t 12 /nobreak >nul

REM --- Open the app in the default browser ---
start "" http://localhost:5173

echo.
echo If the browser did not open, go to:  http://localhost:5173
echo.
pause
