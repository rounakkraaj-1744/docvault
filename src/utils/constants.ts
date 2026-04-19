import { readAsStringAsync, writeAsStringAsync, getInfoAsync, deleteAsync, cacheDirectory, EncodingType, documentDirectory } from 'expo-file-system/legacy';

export const DATABASE_NAME = 'DocVault.db';
export const ENCRYPTION_KEY_ALIAS = 'docvault_encryption_key';
export const PIN_KEY = 'docvault_pin';
export const DOCUMENTS_DIR = `${documentDirectory}documents/`;

export const DOCUMENT_CATEGORIES = [
  '10th Certificate',
  '12th Certificate',
  'Aadhaar Card',
  'PAN Card',
  'Driving License',
  'Passport',
  'Vehicle Insurance',
  'Health Insurance',
  'Medical Records',
  'Passport Size Photos',
  'Other',
];

export const THEME_COLORS = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#2563EB',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    error: '#EF4444',
    success: '#10B981',
    card: '#FFFFFF',
  },
  dark: {
    background: '#0B1220',
    surface: '#111827',
    primary: '#3B82F6',
    text: '#E5E7EB',
    textSecondary: '#9CA3AF',
    border: '#1F2937',
    error: '#F87171',
    success: '#34D399',
    card: '#1F2937',
  },
};
