import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

const KEY_ALIAS = 'docvault_encryption_key';

export class EncryptionService {
  private static key: string | null = null;

  private static async getOrCreateKey(): Promise<string> {
    if (this.key)
      return this.key;

    let storedKey = await SecureStore.getItemAsync(KEY_ALIAS);

    if (storedKey) {
      this.key = storedKey;
      return this.key;
    }

    const newKey = CryptoJS.lib.WordArray.random(32).toString();
    await SecureStore.setItemAsync(KEY_ALIAS, newKey, {
      keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    });
    this.key = newKey;
    return newKey;
  }

  static async encryptFile(filePath: string, targetPath: string): Promise<void> {
    try {
      const key = await this.getOrCreateKey();
      const fileData = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const encrypted = CryptoJS.AES.encrypt(fileData, key).toString();
      await FileSystem.writeAsStringAsync(targetPath, encrypted, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } 
    catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt document');
    }
  }

  static async decryptFile(encryptedFilePath: string): Promise<string> {
    try {
      const key = await this.getOrCreateKey();
      const encryptedData = await FileSystem.readAsStringAsync(encryptedFilePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      const tempPath = `${FileSystem.cacheDirectory}${Date.now()}_temp`;
      await FileSystem.writeAsStringAsync(tempPath, decryptedData, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return tempPath;
    } 
    catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt document');
    }
  }

  static async clearTempFile(tempPath: string): Promise<void> {
    try {
      const info = await FileSystem.getInfoAsync(tempPath);
      if (info.exists) {
        await FileSystem.deleteAsync(tempPath, { idempotent: true });
      }
    } 
    catch (error) {
      console.warn('Failed to delete temp file:', error);
    }
  }
}