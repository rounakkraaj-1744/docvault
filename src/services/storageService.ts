import RNFS from 'react-native-fs';
import { EncryptionService } from './encryptionService';
import { dbService, DocumentRecord } from '../database/db';

const DOCUMENTS_DIR = `${RNFS.DocumentDirectoryPath}/documents`;

export class StorageService {
  static async init() {
    const exists = await RNFS.exists(DOCUMENTS_DIR);
    if (!exists) {
      await RNFS.mkdir(DOCUMENTS_DIR);
    }
  }

  static async saveDocument(
    sourcePath: string,
    name: string,
    category: string,
    fileType: string
  ): Promise<void> {
    await this.init();
    
    const fileName = `${Date.now()}.enc`;
    const targetPath = `${DOCUMENTS_DIR}/${fileName}`;
    
    // Encrypt and save to internal storage
    await EncryptionService.encryptFile(sourcePath, targetPath);
    
    // Save metadata to DB
    await dbService.addDocument({
      name,
      category,
      file_path: targetPath,
      file_type: fileType,
    });

    // Optionally delete the source file if it's a temporary one (like from camera)
    if (sourcePath.includes('cache') || sourcePath.includes('tmp')) {
      try {
        await RNFS.unlink(sourcePath);
      } catch (e) {
        console.warn('Failed to delete source file', e);
      }
    }
  }

  static async viewDocument(doc: DocumentRecord): Promise<string> {
    // Decrypt to a temporary file for viewing
    return await EncryptionService.decryptFile(doc.file_path);
  }

  static async deleteDocument(doc: DocumentRecord): Promise<void> {
    // Delete from DB
    if (doc.id) {
      await dbService.deleteDocument(doc.id);
    }
    
    // Delete encrypted file
    const exists = await RNFS.exists(doc.file_path);
    if (exists) {
      await RNFS.unlink(doc.file_path);
    }
  }
}
