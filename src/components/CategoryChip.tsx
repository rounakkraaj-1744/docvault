import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const CategoryChip = ({ label, selected, onPress }: Props) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: theme.surface, borderColor: theme.border },
        selected ? { backgroundColor: theme.primary, borderColor: theme.primary } : null
      ]}
    >
      <Text style={[styles.text, { color: theme.textSecondary }, selected ? { color: '#FFF' } : null]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, borderWidth: 1, marginHorizontal: 6, marginVertical: 4 },
  text: { fontSize: 14, fontWeight: '600' },
});
