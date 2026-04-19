import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const database_name = "DocVault.db";

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
  private _db: SQLiteDatabase | null = null;

  async getDB() {
    if (this._db) return this._db;
    
    this._db = await SQLite.openDatabase({
      name: database_name,
      location: 'default',
    });
    
    await this.init();
    return this._db;
  }

  private async init() {
    if (!this._db) return;
    
    await this._db.executeSql(`
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
    const results = await db.executeSql('SELECT * FROM documents ORDER BY created_at DESC');
    const documents: DocumentRecord[] = [];
    
    const len = results[0].rows.length;
    for (let i = 0; i < len; i++) {
      documents.push(results[0].rows.item(i));
    }
    
    return documents;
  }

  async addDocument(doc: DocumentRecord) {
    const db = await this.getDB();
    await db.executeSql(
      'INSERT INTO documents (name, category, file_path, file_type) VALUES (?, ?, ?, ?)',
      [doc.name, doc.category, doc.file_path, doc.file_type]
    );
  }

  async deleteDocument(id: number) {
    const db = await this.getDB();
    await db.executeSql('DELETE FROM documents WHERE id = ?', [id]);
  }

  async searchDocuments(query: string): Promise<DocumentRecord[]> {
    const db = await this.getDB();
    const results = await db.executeSql(
      'SELECT * FROM documents WHERE name LIKE ? OR category LIKE ? ORDER BY created_at DESC',
      [`%${query}%`, `%${query}%`]
    );
    const documents: DocumentRecord[] = [];
    const len = results[0].rows.length;
    for (let i = 0; i < len; i++) {
      documents.push(results[0].rows.item(i));
    }
    return documents;
  }
}

export const dbService = new Database();
