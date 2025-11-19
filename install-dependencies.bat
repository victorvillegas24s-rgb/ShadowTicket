@echo off
echo ========================================
echo   Instalando dependencias del proyecto
echo ========================================
echo.

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no esta instalado.
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo Instala la version LTS (Long Term Support)
    echo.
    pause
    exit /b 1
)

echo Instalando Expo CLI globalmente...
call npm install -g expo-cli

echo.
echo Instalando dependencias del proyecto...
call npm install

echo.
echo ========================================
echo   Instalacion completada!
echo ========================================
echo.
echo Ahora puedes ejecutar: start-expo.bat
echo.
pause


