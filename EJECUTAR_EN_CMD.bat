@echo off
echo ========================================
echo   Iniciando Expo para generar QR
echo ========================================
echo.
echo Limpiando procesos anteriores...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo.
echo Iniciando Expo...
echo Espera 30-60 segundos para que aparezca el codigo QR...
echo.
call npm start
pause

