@echo off
setlocal
title Cognitive Stress Tracker - Step 1: Install tools

echo ==================================================
echo   Cognitive Stress Tracker  -  STEP 1
echo   Installing developer tools (one time only)
echo ==================================================
echo.
echo This will install: Python, Node.js, Git, MongoDB, VS Code.
echo.
echo Windows will pop up "Do you want to allow this app to make
echo changes?" a few times - click YES each time.
echo.
pause

REM --- Make sure winget (Windows Package Manager) is available ---
where winget >nul 2>nul
if errorlevel 1 (
  echo.
  echo [PROBLEM] "winget" was not found on this PC.
  echo Open the Microsoft Store, search for "App Installer", install/update it,
  echo then run this file again.
  echo.
  pause
  exit /b 1
)

echo.
echo ---- Installing Python 3.12 ----
winget install -e --id Python.Python.3.12 --accept-package-agreements --accept-source-agreements

echo.
echo ---- Installing Node.js (LTS) ----
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements

echo.
echo ---- Installing Git ----
winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements

echo.
echo ---- Installing MongoDB (database) ----
winget install -e --id MongoDB.Server --accept-package-agreements --accept-source-agreements

echo.
echo ---- Installing VS Code (code editor) ----
winget install -e --id Microsoft.VisualStudioCode --accept-package-agreements --accept-source-agreements

echo.
echo ==================================================
echo   STEP 1 DONE!
echo.
echo   IMPORTANT: Restart your computer now (this lets
echo   Windows finish setting up Python and Node).
echo.
echo   After restarting, double-click:  2-setup-project.bat
echo ==================================================
echo.
pause
