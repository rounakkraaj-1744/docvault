import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText } from 'lucide-react-native';
import { DocumentRecord } from '../utils/types';
import { useTheme } from '../hooks/useTheme';

interface Props {
  document: DocumentRecord;
  onPress: () => void;
}

export const VaultCard = ({ document, onPress }: Props) => {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: theme.primary + '15' }]}>
        <FileText color={theme.primary} size={28} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{document.name}</Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>{document.category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, margin: 8, padding: 16, borderRadius: 20, borderWidth: 1, minHeight: 150, justifyContent: 'space-between' },
  iconBox: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  info: { marginTop: 12 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  meta: { fontSize: 12, fontWeight: '500' },
});
