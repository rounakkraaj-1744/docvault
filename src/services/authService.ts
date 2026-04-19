import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { PIN_KEY } from '../utils/constants';

export class AuthService {
  static async checkHasPin(): Promise<boolean> {
    const pin = await SecureStore.getItemAsync(PIN_KEY);
    return !!pin;
  }

  static async setPin(pin: string): Promise<void> {
    await SecureStore.setItemAsync(PIN_KEY, pin, {
      keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    });
  }

  static async verifyPin(pin: string): Promise<boolean> {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    return storedPin === pin;
  }

  static async isBiometricAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  static async authenticateBiometric(): Promise<boolean> {
    try {
      const available = await this.isBiometricAvailable();
      if (!available) return false;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock DocVault',
        fallbackLabel: 'Use PIN',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric auth failed:', error);
      return false;
    }
  }
}
