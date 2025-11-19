# Instrucciones de Instalación

## Paso 1: Instalar Node.js y npm

Si no tienes Node.js instalado:

1. Descarga Node.js desde: https://nodejs.org/
2. Instala la versión LTS (Long Term Support)
3. Verifica la instalación abriendo una terminal y ejecutando:
   ```bash
   node --version
   npm --version
   ```

## Paso 2: Instalar Expo CLI

```bash
npm install -g expo-cli
```

## Paso 3: Instalar dependencias del proyecto

Navega a la carpeta del proyecto y ejecuta:

```bash
npm install
```

## Paso 4: Iniciar el proyecto

```bash
npm start
```

O si prefieres usar Expo directamente:

```bash
npx expo start
```

## Paso 5: Conectar con Expo Go

1. Instala **Expo Go** en tu dispositivo móvil:
   - iOS: App Store
   - Android: Google Play Store

2. Escanea el código QR que aparece en la terminal:
   - **iOS**: Usa la cámara del iPhone
   - **Android**: Abre Expo Go y escanea el QR

## Solución de Problemas

### Si npm no se reconoce:
- Reinicia tu terminal después de instalar Node.js
- Verifica que Node.js esté en el PATH del sistema
- En Windows, puede ser necesario reiniciar la computadora

### Si hay errores de dependencias:
```bash
# Limpia el caché y reinstala
rm -rf node_modules
npm cache clean --force
npm install
```

### Para usar en dispositivo físico:
1. Asegúrate de que tu dispositivo y computadora estén en la misma red WiFi
2. En `src/services/apiService.js`, cambia la URL de `localhost` a la IP de tu computadora
3. Ejemplo: `http://192.168.1.100:8000/api.php`


