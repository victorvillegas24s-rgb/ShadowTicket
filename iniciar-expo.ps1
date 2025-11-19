Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Expo..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Limpiar procesos anteriores
Write-Host "Limpiando procesos anteriores..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Iniciando servidor Expo..." -ForegroundColor Green
Write-Host "Espera unos segundos para que aparezca el código QR..." -ForegroundColor Yellow
Write-Host ""

# Iniciar Expo
npx expo start --clear

