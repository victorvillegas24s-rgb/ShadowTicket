# 🔧 Solución: No aparece el código QR

## Posibles causas y soluciones:

### 1. Verificar que Expo esté corriendo
Abre una nueva terminal PowerShell en esta carpeta y ejecuta:
```powershell
npx expo start
```

### 2. Si el puerto está ocupado
```powershell
# Detener procesos de Node.js
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Iniciar en otro puerto
npx expo start --port 8082
```

### 3. Limpiar caché y reiniciar
```powershell
npx expo start --clear
```

### 4. Usar modo túnel (si estás en una red diferente)
```powershell
npx expo start --tunnel
```

### 5. Verificar que todas las dependencias estén instaladas
```powershell
npm install
```

### 6. Verificar la configuración
Asegúrate de que `app.json` y `package.json` estén correctos.

## Comando recomendado:
```powershell
# Detener procesos anteriores
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Limpiar y reiniciar
npx expo start --clear
```

## Si aún no funciona:
1. Cierra todas las terminales
2. Abre una nueva terminal PowerShell
3. Navega a esta carpeta: `cd "C:\Users\Yecsa\Documents\flutter_application_1"`
4. Ejecuta: `npx expo start --clear`
5. Espera 30-60 segundos para que aparezca el QR

## Alternativa: Usar Expo Go manualmente
1. Abre Expo Go en tu celular
2. Presiona "Enter URL manually"
3. Ingresa la URL que aparece en la terminal (ej: `exp://192.168.1.100:8081`)

