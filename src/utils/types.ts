export interface DocumentRecord {
  id?: number;
  name: string;
  category: string;
  file_path: string;
  file_type: string;
  created_at?: string;
  updated_at?: string;
}

export type DocumentCategory = string;

export interface AppState {
  isDarkMode: boolean;
  biometricsEnabled: boolean;
}

export interface AuthState {
  isLocked: boolean;
  hasPin: boolean;
}

export interface DocumentState {
  documents: DocumentRecord[];
  isLoading: boolean;
}
