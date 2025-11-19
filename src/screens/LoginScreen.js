import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import apiService from '../services/apiService';
import sessionService from '../services/sessionService';

const primaryDark = '#131A26';
const accentBlue = '#00BFFF';
const secondaryDark = '#202A3B';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscureText, setObscureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail || !password) {
      Alert.alert('Error', 'Por favor, ingresa correo y contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[Login] Iniciando login...');
      const result = await apiService.login(trimmedEmail, password);
      console.log('[Login] API response:', result);

      if (result.success === true) {
        const user = result.user;
        console.log('[Login] Usuario recibido:', user);
        
        const role = user.Nombre_Rol?.trim();
        console.log('[Login] Rol obtenido:', role);

        await sessionService.saveUserData(user);
        console.log('[Login] Sesión guardada exitosamente');

        Alert.alert('Éxito', `Inicio de sesión exitoso. Rol: ${role}`);

        if (role) {
          const roleLower = role.toLowerCase();
          console.log('[Login] Rol normalizado:', roleLower);

          if (roleLower === 'administrador') {
            navigation.replace('Admin', { user });
          } else if (roleLower === 'tecnico') {
            navigation.replace('Technician', { user });
          } else if (roleLower === 'estandar') {
            navigation.replace('Standard', { user });
          } else {
            console.log('[Login] ERROR: Rol no reconocido:', roleLower);
            await sessionService.logout();
            Alert.alert('Error', `Rol de usuario no reconocido: ${role}`);
          }
        } else {
          console.log('[Login] ERROR: Rol es null');
          await sessionService.logout();
          Alert.alert('Error', 'Rol de usuario no reconocido');
        }
      } else {
        Alert.alert('Error', result.message || 'Credenciales inválidas o error desconocido.');
      }
    } catch (e) {
      console.error('[Login] Error:', e);
      Alert.alert('Error', `Error de conexión: Verifica la API y la red. (${e.message})`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[primaryDark, '#0A101C']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Shadow Ticket Support</Text>
            <View style={styles.hexagonPlaceholder} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#666"
                secureTextEntry={obscureText}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setObscureText(!obscureText)}
                disabled={isLoading}
              >
                <Text style={styles.eyeButtonText}>
                  {obscureText ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => {}}
              disabled={isLoading}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: accentBlue,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  hexagonPlaceholder: {
    width: 200,
    height: 200,
    opacity: 0.1,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  eyeButtonText: {
    fontSize: 20,
  },
  button: {
    backgroundColor: accentBlue,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotText: {
    color: '#FFF',
    opacity: 0.7,
  },
});


