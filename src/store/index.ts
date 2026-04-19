import { create } from 'zustand';

interface AuthState {
  isLocked: boolean;
  hasPin: boolean;
  setLocked: (locked: boolean) => void;
  setHasPin: (hasPin: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLocked: true,
  hasPin: false,
  setLocked: (locked) => set({ isLocked: locked }),
  setHasPin: (hasPin) => set({ hasPin }),
}));

interface AppState {
  isDarkMode: boolean;
  biometricsEnabled: boolean;
  setDarkMode: (enabled: boolean) => void;
  setBiometricsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: false,
  biometricsEnabled: true,
  setDarkMode: (enabled) => set({ isDarkMode: enabled }),
  setBiometricsEnabled: (enabled) => set({ biometricsEnabled: enabled }),
}));

interface DocumentState {
  documents: any[];
  isLoading: boolean;
  setDocuments: (docs: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  isLoading: false,
  setDocuments: (documents) => set({ documents }),
  setLoading: (isLoading) => set({ isLoading }),
}));
