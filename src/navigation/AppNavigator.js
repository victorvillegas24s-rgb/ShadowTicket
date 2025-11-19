import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import AdminScreen from '../screens/AdminScreen';
import TechnicianScreen from '../screens/TechnicianScreen';
import StandardScreen from '../screens/StandardScreen';
import sessionService from '../services/sessionService';

const Stack = createNativeStackNavigator();
const primaryDark = '#131A26';

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const isLoggedIn = await sessionService.isLoggedIn();
      if (isLoggedIn) {
        const user = await sessionService.getUserData();
        if (user) {
          const role = user.Nombre_Rol?.trim()?.toLowerCase();
          setUserData(user);
          
          if (role === 'administrador') {
            setInitialRoute('Admin');
          } else if (role === 'tecnico') {
            setInitialRoute('Technician');
          } else if (role === 'estandar') {
            setInitialRoute('Standard');
          } else {
            await sessionService.logout();
            setInitialRoute('Login');
          }
        } else {
          setInitialRoute('Login');
        }
      } else {
        setInitialRoute('Login');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setInitialRoute('Login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="Admin" 
          component={AdminScreen}
          initialParams={userData ? { user: userData } : undefined}
        />
        <Stack.Screen 
          name="Technician" 
          component={TechnicianScreen}
          initialParams={userData ? { user: userData } : undefined}
        />
        <Stack.Screen 
          name="Standard" 
          component={StandardScreen}
          initialParams={userData ? { user: userData } : undefined}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryDark,
  },
});


