import CryptoJS from 'crypto-js';
import * as Keychain from 'react-native-keychain';
import RNFS from 'react-native-fs';

const KEY_ALIAS = 'docvault_encryption_key';

export class EncryptionService {
  private static key: string | null = null;

  private static async getOrCreateKey(): Promise<string> {
    if (this.key) return this.key;

    const credentials = await Keychain.getGenericPassword({
      service: KEY_ALIAS,
    });

    if (credentials) {
      this.key = credentials.password;
      return this.key;
    }

    // Generate a new random key
    const newKey = CryptoJS.lib.WordArray.random(32).toString();
    await Keychain.setGenericPassword('encryption_key', newKey, {
      service: KEY_ALIAS,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    });

    this.key = newKey;
    return newKey;
  }

  static async encryptFile(filePath: string, targetPath: string): Promise<void> {
    try {
      const key = await this.getOrCreateKey();
      const fileData = await RNFS.readFile(filePath, 'base64');
      const encrypted = CryptoJS.AES.encrypt(fileData, key).toString();
      await RNFS.writeFile(targetPath, encrypted, 'utf8');
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt document');
    }
  }

  static async decryptFile(encryptedFilePath: string): Promise<string> {
    try {
      const key = await this.getOrCreateKey();
      const encryptedData = await RNFS.readFile(encryptedFilePath, 'utf8');
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      
      // Create a temporary file path
      const tempPath = `${RNFS.TemporaryDirectoryPath}/${Date.now()}_temp`;
      await RNFS.writeFile(tempPath, decryptedData, 'base64');
      return tempPath;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt document');
    }
  }

  static async clearTempFile(tempPath: string): Promise<void> {
    try {
      const exists = await RNFS.exists(tempPath);
      if (exists) {
        await RNFS.unlink(tempPath);
      }
    } catch (error) {
      console.warn('Failed to delete temp file:', error);
    }
  }
}
