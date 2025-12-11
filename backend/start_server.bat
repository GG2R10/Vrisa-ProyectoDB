@echo off
echo ==========================================
echo       VriSA Backend Launcher
echo ==========================================

echo [INFO] Starting Database (Docker)...
docker-compose --file ../docker-compose.yml up -d postgres

if not exist venv (
    echo [INFO] Creating virtual environment...
    python -m venv venv
)

echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

echo [INFO] Installing requirements...
pip install -r requirements.txt

echo.
echo [INFO] Applying Migrations...
python manage.py migrate

echo.
echo [SUCCESS] Environment ready.
echo [INFO] Starting Server on 0.0.0.0:8000 (Accessible to Mobile)...
echo.
python manage.py runserver 0.0.0.0:8000
pause
