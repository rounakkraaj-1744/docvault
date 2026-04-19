import { useNavigation } from '@react-navigation/native';
import { Fingerprint, Lock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AuthService } from '../services/auth.service';
import { useAppStore, useAuthStore } from '../store';

const LockScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { hasPin, setLocked } = useAuthStore();
  const biometricsEnabled = useAppStore((state) => state.biometricsEnabled);
  const [pin, setPin] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(!hasPin);

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Lock size={48} color={theme.primary} />
        <Text style={[styles.title, { color: theme.text }]}>
          {isSettingPin ? 'Set Your PIN' : 'Enter PIN to Unlock'}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.pinInput, { color: theme.text, borderColor: theme.border }]}
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          secureTextEntry
          maxLength={6}
          placeholder="----"
          placeholderTextColor={theme.textSecondary}
          autoFocus
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handlePinSubmit}
      >
        <Text style={styles.buttonText}>{isSettingPin ? 'Create PIN' : 'Unlock'}</Text>
      </TouchableOpacity>

      {hasPin && biometricsEnabled && (
        <TouchableOpacity style={styles.biometricBtn} onPress={handleBiometric}>
          <Fingerprint size={40} color={theme.primary} />
          <Text style={[styles.biometricText, { color: theme.textSecondary }]}>
            Use Biometrics
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  pinInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 10,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  biometricBtn: {
    marginTop: 40,
    alignItems: 'center',
  },
  biometricText: {
    marginTop: 10,
    fontSize: 14,
  },
});

export default LockScreen;
