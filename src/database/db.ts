import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'DocVault.db';

export interface DocumentRecord {
  id?: number;
  name: string;
  category: string;
  file_path: string;
  file_type: string;
  created_at?: string;
  updated_at?: string;
}

class Database {
  private _db: SQLite.SQLiteDatabase | null = null;

  async getDB() {
    if (this._db) return this._db;
    this._db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await this.init();
    return this._db;
  }

  private async init() {
    const db = this._db;
    if (!db) return;
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  async getAllDocuments(): Promise<DocumentRecord[]> {
    const db = await this.getDB();
    return await db.getAllAsync<DocumentRecord>('SELECT * FROM documents ORDER BY created_at DESC');
  }

  async addDocument(doc: DocumentRecord) {
    const db = await this.getDB();
    await db.runAsync(
      'INSERT INTO documents (name, category, file_path, file_type) VALUES (?, ?, ?, ?)',
      [doc.name || '', doc.category, doc.file_path, doc.file_type]
    );
  }

  async deleteDocument(id: number) {
    const db = await this.getDB();
    await db.runAsync('DELETE FROM documents WHERE id = ?', [id]);
  }

  async searchDocuments(query: string): Promise<DocumentRecord[]> {
    const db = await this.getDB();
    return await db.getAllAsync<DocumentRecord>(
      'SELECT * FROM documents WHERE name LIKE ? OR category LIKE ? ORDER BY created_at DESC',
      [`%${query}%`, `%${query}%`]
    );
  }
}

export const dbService = new Database();
