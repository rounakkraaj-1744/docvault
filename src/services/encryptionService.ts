import * as CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';
import { readAsStringAsync, writeAsStringAsync, getInfoAsync, deleteAsync, cacheDirectory, EncodingType } from 'expo-file-system';
import { ENCRYPTION_KEY_ALIAS } from '../utils/constants';

export class EncryptionService {
  private static key: string | null = null;

  private static async getOrCreateKey(): Promise<string> {
    if (this.key) 
      return this.key;
    try {
      let storedKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_ALIAS);
      if (storedKey) {
        this.key = storedKey;
        return this.key;
      }
      const newKey = CryptoJS.lib.WordArray.random(32).toString();
      await SecureStore.setItemAsync(ENCRYPTION_KEY_ALIAS, newKey, {
        keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
      });
      this.key = newKey;
      return newKey;
    }
    catch (e) {
      console.error('SecureStore Error:', e);
      throw new Error('Could not access secure encryption key');
    }
  }

  static async encryptFile(filePath: string, targetPath: string): Promise<void> {
    try {
      const key = await this.getOrCreateKey();
      const fileData = await readAsStringAsync(filePath, {
        encoding: EncodingType.Base64,
      });
      const encrypted = CryptoJS.AES.encrypt(fileData, key).toString();
      await writeAsStringAsync(targetPath, encrypted, {
        encoding: EncodingType.UTF8,
      });
    }
    catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  static async decryptFile(encryptedFilePath: string): Promise<string> {
    try {
      const key = await this.getOrCreateKey();
      const encryptedData = await readAsStringAsync(encryptedFilePath, {
        encoding: EncodingType.UTF8,
      });
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedData)
        throw new Error('Decryption resulted in empty data');

      const tempPath = cacheDirectory + `${Date.now()}_temp`;
      await writeAsStringAsync(tempPath, decryptedData, {
        encoding: EncodingType.Base64,
      });
      return tempPath;
    }
    catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }

  static async clearTempFile(tempPath: string): Promise<void> {
    try {
      const info = await getInfoAsync(tempPath);
      if (info.exists) {
        await deleteAsync(tempPath, { idempotent: true });
      }
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  }
}