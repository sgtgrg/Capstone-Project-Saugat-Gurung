@echo off
setlocal
title Save progress to GitHub
cd /d "%~dp0"

echo ==================================================
echo   Save your progress to GitHub
echo ==================================================
echo.
set /p msg="Type a short note about what you did today: "
if "%msg%"=="" set msg=Update progress

echo.
echo Saving...
git add .
git commit -m "%msg%"
git push

echo.
echo Done. (The first time, a GitHub login window may appear - log in once.)
echo.
pause
