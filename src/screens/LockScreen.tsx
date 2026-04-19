import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Fingerprint, Lock, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { AuthService } from '../services/authService';
import { useAppStore, useAuthStore } from '../store';

const LockScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { hasPin, setLocked } = useAuthStore();
  const biometricsEnabled = useAppStore((state) => state.biometricsEnabled);
  
  const [pin, setPin] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(!!(hasPin === false));

  useEffect(() => {
    if (hasPin && biometricsEnabled) {
      handleBiometric();
    }
  }, [hasPin]);

  const handleBiometric = async () => {
    const success = await AuthService.authenticateBiometric();
    if (success) {
      unlock();
    }
  };

  const handlePinSubmit = async () => {
    if (isSettingPin) {
      if (pin.length < 4) {
        Alert.alert('Error', 'PIN must be at least 4 digits');
        return;
      }
      await AuthService.setPin(pin);
      Alert.alert('Success', 'PIN set successfully');
      unlock();
    } else {
      const valid = await AuthService.verifyPin(pin);
      if (valid) {
        unlock();
      } else {
        Alert.alert('Error', 'Invalid PIN');
        setPin('');
      }
    }
  };

  const unlock = () => {
    setLocked(false);
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
            <Lock size={40} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {isSettingPin ? 'Create Secure PIN' : 'Welcome Back'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isSettingPin ? 'Set a 4-6 digit PIN to protect your vault' : 'Enter your PIN to access your documents'}
          </Text>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={[styles.pinInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry={true}
            maxLength={6}
            placeholder="······"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }, pin.length < 4 && { opacity: 0.5 }]}
          onPress={handlePinSubmit}
          disabled={pin.length < 4}
        >
          <Text style={styles.buttonText}>{isSettingPin ? 'Setup Vault' : 'Unlock Vault'}</Text>
        </TouchableOpacity>

        {!isSettingPin && biometricsEnabled && (
          <TouchableOpacity style={styles.biometricBtn} onPress={handleBiometric}>
            <Fingerprint size={48} color={theme.primary} />
            <Text style={[styles.biometricText, { color: theme.primary }]}>
              Unlock with Biometrics
            </Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.footer}>
          <ShieldCheck size={16} color={theme.success} />
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>End-to-End Encrypted</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 32, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  iconContainer: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  inputSection: { marginBottom: 32 },
  pinInput: { height: 70, borderWidth: 1.5, borderRadius: 16, fontSize: 32, textAlign: 'center', letterSpacing: 12, fontWeight: '700' },
  button: { height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  biometricBtn: { alignItems: 'center', marginTop: 20 },
  biometricText: { marginTop: 12, fontSize: 14, fontWeight: '700' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', paddingTop: 20 },
  footerText: { marginLeft: 8, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
});

export default LockScreen;
