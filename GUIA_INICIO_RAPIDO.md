# 🚀 Guía de Inicio Rápido - Expo Go

## Paso 1: Instalar Node.js

Si no tienes Node.js instalado:

1. Ve a: **https://nodejs.org/**
2. Descarga la versión **LTS** (Long Term Support)
3. Instala Node.js (incluye npm automáticamente)
4. Reinicia tu terminal/PowerShell después de instalar

## Paso 2: Instalar Dependencias

### Opción A: Usar el script automático (Windows)
Doble clic en: **`install-dependencies.bat`**

### Opción B: Manualmente
Abre PowerShell o CMD en esta carpeta y ejecuta:
```bash
npm install -g expo-cli
npm install
```

## Paso 3: Iniciar el Proyecto

### Opción A: Usar el script automático (Windows)
Doble clic en: **`start-expo.bat`**

### Opción B: Manualmente
```bash
npm start
```
O:
```bash
npx expo start
```

## Paso 4: Conectar con Expo Go

1. **Instala Expo Go** en tu dispositivo móvil:
   - 📱 **iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
   - 🤖 **Android**: [Google Play - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Escanea el código QR**:
   - **iOS**: Abre la cámara del iPhone y apunta al QR
   - **Android**: Abre Expo Go y presiona "Scan QR code"

3. **¡Listo!** La app se cargará en tu dispositivo

## 📱 Comandos Útiles

```bash
# Iniciar en modo desarrollo
npm start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios

# Limpiar caché si hay problemas
npx expo start -c
```

## ⚠️ Solución de Problemas

### Error: "npm no se reconoce"
- Instala Node.js desde nodejs.org
- Reinicia tu terminal después de instalar

### Error: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### La app no se conecta
- Asegúrate de que tu dispositivo y computadora estén en la misma red WiFi
- Verifica que el firewall no esté bloqueando la conexión

### Para usar en dispositivo físico
- En `src/services/apiService.js`, cambia `localhost` por la IP de tu computadora
- Ejemplo: `http://192.168.1.100:8000/api.php`

## 🔗 Enlaces Útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [Guía de Expo Go](https://docs.expo.dev/get-started/installation/)
- [Node.js Download](https://nodejs.org/)


