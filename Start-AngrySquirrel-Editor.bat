@echo off
setlocal

title AngrySquirrel.org Local Editor
cd /d "%~dp0"

if not exist "package.json" (
    echo.
    echo ERROR: package.json was not found.
    echo Place this file in the root of your GTP_Port repository,
    echo next to package.json, and run it again.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo.
    echo ERROR: npm was not found. Make sure Node.js is installed
    echo and available in your Windows PATH.
    echo.
    pause
    exit /b 1
)

echo Starting the AngrySquirrel.org local editor...
echo TinaCMS will be available at http://localhost:4321/admin/index.html
echo Press Ctrl+C when you want to stop the server.
echo.

call npm run dev

if errorlevel 1 (
    echo.
    echo The development server stopped with an error.
    pause
)

endlocal
