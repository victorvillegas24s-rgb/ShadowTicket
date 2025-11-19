# Ticket Shadow Support - React Native

Aplicación móvil de gestión de tickets desarrollada con React Native y Expo.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn
- Expo CLI instalado globalmente: `npm install -g expo-cli`
- Expo Go app instalada en tu dispositivo móvil (iOS o Android)

### Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm start
```

3. Escanea el código QR con Expo Go:
   - **iOS**: Usa la cámara del iPhone
   - **Android**: Usa la app Expo Go para escanear el QR

### Ejecutar en diferentes plataformas

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📱 Estructura del Proyecto

```
├── App.js                 # Punto de entrada de la aplicación
├── src/
│   ├── navigation/        # Configuración de navegación
│   │   └── AppNavigator.js
│   ├── screens/          # Pantallas de la aplicación
│   │   ├── LoginScreen.js
│   │   ├── AdminScreen.js
│   │   ├── TechnicianScreen.js
│   │   └── StandardScreen.js
│   └── services/         # Servicios de API y sesión
│       ├── apiService.js
│       └── sessionService.js
├── package.json
└── app.json              # Configuración de Expo
```

## 🔧 Configuración

### API Backend

La aplicación se conecta a una API PHP en `localhost:8000`. 

- **Android Emulator**: Usa `http://10.0.2.2:8000/api.php`
- **iOS Simulator/Dispositivo físico**: Usa `http://localhost:8000/api.php` o la IP de tu máquina

Para usar en un dispositivo físico, asegúrate de que:
1. Tu dispositivo y tu computadora estén en la misma red WiFi
2. Reemplaza `localhost` con la IP local de tu computadora (ej: `http://192.168.1.100:8000/api.php`)

## 📦 Dependencias Principales

- **expo**: Framework de React Native
- **@react-navigation/native**: Navegación entre pantallas
- **axios**: Cliente HTTP para llamadas a la API
- **@react-native-async-storage/async-storage**: Almacenamiento local
- **expo-linear-gradient**: Gradientes para el diseño

## 🎨 Roles de Usuario

- **Administrador**: Gestiona tickets y usuarios
- **Técnico**: Acepta y cierra tickets asignados
- **Estándar**: Crea y visualiza sus propios tickets

## 📝 Notas

- La aplicación está configurada para funcionar con Expo Go
- Asegúrate de que tu servidor PHP esté corriendo antes de iniciar sesión
- Los datos de sesión se guardan localmente usando AsyncStorage


