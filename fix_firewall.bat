@echo off
echo ==========================================
echo       VriSA Connection Fixer
echo ==========================================
echo.
echo This script will open ports 3000 and 8000 in your Windows Firewall
echo to allow your phone to connect.
echo.
echo [IMPORTANT] You must Right-Click this file and select "Run as Administrator"
echo.
pause

echo.
echo Opening Port 3000 (React)...
netsh advfirewall firewall add rule name="VriSA Frontend" dir=in action=allow protocol=TCP localport=3000

echo Opening Port 8000 (Django)...
netsh advfirewall firewall add rule name="VriSA Backend" dir=in action=allow protocol=TCP localport=8000

echo.
echo Done! Please restart your frontend and backend and try again.
pause
