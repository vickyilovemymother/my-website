@echo off
title Vigneshwaran Pugazhenthi Portfolio Dev Server
echo ================================================================
echo   Vigneshwaran Pugazhenthi Portfolio - Principal R^&D Technologist
echo ================================================================
echo.
echo Launching local development server on http://localhost:5173/ ...
echo.
timeout /t 2 /nobreak > nul
start "" "http://localhost:5173/"
npm run dev
pause
