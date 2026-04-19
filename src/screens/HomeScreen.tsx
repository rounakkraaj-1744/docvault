import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { dbService } from '../database/db';
import { useDocumentStore } from '../store';
import { DOCUMENT_CATEGORIES } from '../utils/constants';
import { DocumentRecord } from '../utils/types';
import { VaultCard } from '../components/VaultCard';
import { CategoryChip } from '../components/CategoryChip';
import { Plus, Search, Settings as SettingsIcon } from 'lucide-react-native';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { documents, setDocuments, isLoading, setLoading } = useDocumentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [searchQuery, selectedCategory]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      let docs: DocumentRecord[];
      if (searchQuery) {
        docs = await dbService.searchDocuments(searchQuery);
      } else {
        docs = await dbService.getAllDocuments();
      }

      if (selectedCategory) {
        docs = docs.filter(d => d.category === selectedCategory);
      }

      setDocuments(docs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>My Vault</Text>
          <Text style={[styles.title, { color: theme.text }]}>Documents</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <SettingsIcon color={theme.text} size={24} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
        <Search size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search documents..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', ...DOCUMENT_CATEGORIES]}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 14 }}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              selected={item === 'All' ? selectedCategory === null : selectedCategory === item}
              onPress={() => setSelectedCategory(item === 'All' ? null : item)}
            />
          )}
        />
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <VaultCard
              document={item}
              onPress={() => navigation.navigate('Viewer', { document: item })}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ color: theme.textSecondary }}>No documents found</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('Upload')}
      >
        <Plus color="#FFF" size={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: '800', marginTop: 4 },
  searchContainer: { marginHorizontal: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderRadius: 16, height: 56 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '500' },
  categoriesContainer: { marginBottom: 16 },
  listContent: { paddingHorizontal: 12, paddingBottom: 100 },
  loader: { flex: 1, justifyContent: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  fab: { position: 'absolute', right: 24, bottom: 32, width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
});

export default HomeScreen;