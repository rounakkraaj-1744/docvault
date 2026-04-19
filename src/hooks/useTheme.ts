import { useAppStore } from '../store';
import { THEME_COLORS } from '../utils/constants';

export const useTheme = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  return isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;
};
