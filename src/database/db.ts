import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../utils/constants';
import { DocumentRecord } from '../utils/types';

class Database {
  private _db: SQLite.SQLiteDatabase | null = null;
  private _initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

  async getDB(): Promise<SQLite.SQLiteDatabase> {
    if (this._db)
      return this._db;
    if (this._initPromise)
      return this._initPromise;

    this._initPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      this._db = db;
      await this.init(db);
      return db;
    })();

    return this._initPromise;
  }

  private async init(db: SQLite.SQLiteDatabase) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
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
      [doc.name, doc.category, doc.file_path, doc.file_type]
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