@echo off
echo ==========================================
echo       VriSA Mobile Launcher
echo ==========================================

:: 1. Find the Local WiFi IP Address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4" ^| find "192.168"') do set IP=%%a
set IP=%IP: =%
echo [INFO] Detected Local IP: %IP%

:: 2. Set API URL to this IP so the phone can reach the backend
set REACT_APP_API_URL=http://%IP%:8000/
echo [INFO] Configured Backend URL: %REACT_APP_API_URL%

:: 3. Warn user to start backend
echo.
echo [IMPORTANT] Make sure your Backend is running in another terminal:
echo            python manage.py runserver 0.0.0.0:8000
echo.

:: 4. Start Frontend
echo [INFO] Starting React App...
echo [TIP]  On your phone, visit: http://%IP%:3000
echo.
cd frontend
set HOST=0.0.0.0
npm start
pause
