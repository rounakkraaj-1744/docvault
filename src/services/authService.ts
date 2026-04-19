import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

const PIN_SERVICE = 'docvault_pin_service';
const rnBiometrics = new ReactNativeBiometrics();

export class AuthService {
  static async checkHasPin(): Promise<boolean> {
    const credentials = await Keychain.getGenericPassword({ service: PIN_SERVICE });
    return !!credentials;
  }

  static async setPin(pin: string): Promise<void> {
    await Keychain.setGenericPassword('vault_pin', pin, { service: PIN_SERVICE });
  }

  static async verifyPin(pin: string): Promise<boolean> {
    const credentials = await Keychain.getGenericPassword({ service: PIN_SERVICE });
    return credentials && credentials.password === pin;
  }

  static async isBiometricAvailable(): Promise<boolean> {
    const { available } = await rnBiometrics.isSensorAvailable();
    return available;
  }

  static async authenticateBiometric(): Promise<boolean> {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      
      if (!available) return false;

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: `Unlock with ${biometryType === BiometryTypes.FaceID ? 'Face ID' : 'Fingerprint'}`,
        cancelButtonText: 'Use PIN',
      });

      return success;
    } catch (error) {
      console.error('Biometric auth failed:', error);
      return false;
    }
  }
}
