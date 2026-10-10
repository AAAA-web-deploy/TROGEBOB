@echo off
cd /d "%~dp0site"
echo Trogebob local preview: http://localhost:4173
start "" "http://localhost:4173"
py -3 -m http.server 4173
if errorlevel 1 python -m http.server 4173
pause
