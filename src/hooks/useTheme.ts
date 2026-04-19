import { useAppStore } from '../store';
import { colors } from '../theme/colors';

export const useTheme = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  return isDarkMode ? colors.dark : colors.light;
};
