import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_USER = 'user_data';
const KEY_IS_LOGGED_IN = 'is_logged_in';

class SessionService {
  // Guardar datos de usuario y sesión
  async saveUserData(userData) {
    try {
      await AsyncStorage.setItem(KEY_USER, JSON.stringify(userData));
      await AsyncStorage.setItem(KEY_IS_LOGGED_IN, 'true');
    } catch (error) {
      console.error('Error guardando sesión:', error);
    }
  }

  // Obtener datos de usuario
  async getUserData() {
    try {
      const userJson = await AsyncStorage.getItem(KEY_USER);
      if (userJson != null) {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error);
      return null;
    }
  }

  // Verificar si el usuario está logueado
  async isLoggedIn() {
    try {
      const isLoggedIn = await AsyncStorage.getItem(KEY_IS_LOGGED_IN);
      return isLoggedIn === 'true';
    } catch (error) {
      console.error('Error verificando sesión:', error);
      return false;
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await AsyncStorage.removeItem(KEY_USER);
      await AsyncStorage.setItem(KEY_IS_LOGGED_IN, 'false');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }
}

export default new SessionService();


