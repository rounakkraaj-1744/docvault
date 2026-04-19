import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { AuthService } from '../services/authService';
import { useAuthStore } from '../store';
import { Shield } from 'lucide-react-native';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const setHasPin = useAuthStore((state) => state.setHasPin);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const hasPin = await AuthService.checkHasPin();
    setHasPin(hasPin);
    
    // Simulate splash duration
    setTimeout(() => {
      navigation.replace('Lock');
    }, 1500);
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
