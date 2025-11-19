@echo off
echo ========================================
echo   Ticket Shadow Support - Expo Go
echo ========================================
echo.
echo Verificando Node.js...
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

echo Node.js encontrado!
echo.
echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo.
echo Iniciando Expo...
echo.
echo ========================================
echo   Escanea el QR con Expo Go
echo ========================================
echo.
call npx expo start


