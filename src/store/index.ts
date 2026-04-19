import { create } from 'zustand';
import { AuthState, AppState, DocumentState, DocumentRecord } from '../utils/types';

interface AuthStore extends AuthState {
  setLocked: (locked: boolean) => void;
  setHasPin: (hasPin: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLocked: true,
  hasPin: false,
  setLocked: (locked) => set({ isLocked: locked }),
  setHasPin: (hasPin) => set({ hasPin }),
}));

interface AppStore extends AppState {
  setDarkMode: (enabled: boolean) => void;
  setBiometricsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isDarkMode: false,
  biometricsEnabled: true,
  setDarkMode: (enabled) => set({ isDarkMode: enabled }),
  setBiometricsEnabled: (enabled) => set({ biometricsEnabled: enabled }),
}));

interface DocumentStore extends DocumentState {
  setDocuments: (documents: DocumentRecord[]) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  isLoading: false,
  setDocuments: (documents) => set({ documents }),
  setLoading: (isLoading) => set({ isLoading }),
}));
