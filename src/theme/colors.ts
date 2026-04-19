export const colors = {
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

export type ThemeColors = typeof colors.light;
