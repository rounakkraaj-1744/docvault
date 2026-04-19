import { getInfoAsync, makeDirectoryAsync, deleteAsync } from 'expo-file-system';
import { EncryptionService } from './encryptionService';
import { dbService } from '../database/db';
import { DOCUMENTS_DIR } from '../utils/constants';
import { DocumentRecord } from '../utils/types';

export class StorageService {
  static async init() {
    try {
      const info = await getInfoAsync(DOCUMENTS_DIR);
      if (!info.exists) {
        await makeDirectoryAsync(DOCUMENTS_DIR, { intermediates: true });
      }
    } catch (e) {
      console.error('FS Init Error:', e);
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
    const targetPath = DOCUMENTS_DIR + fileName;
    
    await EncryptionService.encryptFile(sourcePath, targetPath);
    
    await dbService.addDocument({
      name,
      category,
      file_path: targetPath,
      file_type: fileType,
    });

    if (sourcePath.includes('cache') || sourcePath.includes('ExperienceData')) {
      try {
        await deleteAsync(sourcePath, { idempotent: true });
      } catch (e) {
        console.warn('Source cleanup skipped:', e);
      }
    }
  }

  static async viewDocument(doc: DocumentRecord): Promise<string> {
    return await EncryptionService.decryptFile(doc.file_path);
  }

  static async deleteDocument(doc: DocumentRecord): Promise<void> {
    if (doc.id !== undefined) {
      await dbService.deleteDocument(doc.id);
    }
    try {
      const info = await getInfoAsync(doc.file_path);
      if (info.exists) {
        await deleteAsync(doc.file_path, { idempotent: true });
      }
    } catch (e) {
      console.error('File deletion error:', e);
    }
  }
}
