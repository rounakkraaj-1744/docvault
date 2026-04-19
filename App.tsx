import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppStore, useAuthStore } from './src/store';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LockScreen from './src/screens/LockScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import ViewerScreen from './src/screens/ViewerScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const isLocked = useAuthStore((state) => state.isLocked);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Lock" component={LockScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="Viewer" component={ViewerScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    </NavigationContainer>
  );
}
