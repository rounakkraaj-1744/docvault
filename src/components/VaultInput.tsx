import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  maxLength?: number;
}

export const VaultInput = ({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = 'default', maxLength }: Props) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>}
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry={!!secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  input: { height: 58, borderWidth: 1.5, borderRadius: 16, paddingHorizontal: 20, fontSize: 16, fontWeight: '500' },
});
