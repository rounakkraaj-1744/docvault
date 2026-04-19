import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'outline';
}

export const ActionButton = ({ label, onPress, loading = false, disabled = false, variant = 'primary' }: Props) => {
  const theme = useTheme();
  
  const getBgColor = () => {
    if (variant === 'danger') return theme.error;
    if (variant === 'outline') return 'transparent';
    return theme.primary;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!!(disabled || loading)}
      style={[
        styles.button,
        { backgroundColor: getBgColor() },
        variant === 'outline' && { borderWidth: 2, borderColor: theme.primary },
        (disabled || loading) && { opacity: 0.6 }
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.primary : '#FFF'} />
      ) : (
        <Text style={[styles.text, { color: variant === 'outline' ? theme.primary : '#FFF' }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', width: '100%' },
  text: { fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
});
