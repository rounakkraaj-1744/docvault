import { useNavigation } from '@react-navigation/native';
import { Shield } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AuthService } from '../services/authService';
import { useAuthStore } from '../store';
import * as SplashScreenLib from 'expo-splash-screen';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const setHasPin = useAuthStore((state) => state.setHasPin);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const hasPin = await AuthService.checkHasPin();
      setHasPin(hasPin);
      
      // Hide native splash screen
      await SplashScreenLib.hideAsync();

      // Navigate
      navigation.replace('Lock');
    } catch (e) {
      console.error(e);
      await SplashScreenLib.hideAsync();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Shield size={64} color={theme.primary} />
      <Text style={[styles.title, { color: theme.text }]}>DocVault</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Securely Offline</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 20,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.7,
  },
});

export default SplashScreen;
