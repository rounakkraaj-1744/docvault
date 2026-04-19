import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { dbService } from '../database/db';
import { useDocumentStore } from '../store';
import { DOCUMENT_CATEGORIES } from '../utils/constants';
import { DocumentRecord } from '../utils/types';
import { Plus, Search, FileText, Settings as SettingsIcon } from 'lucide-react-native';

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
    let docs: DocumentRecord[];
    if (searchQuery) {
      docs = await dbService.searchDocuments(searchQuery);
    }
    else {
      docs = await dbService.getAllDocuments();
    }

    if (selectedCategory) {
      docs = docs.filter(d => d.category === selectedCategory);
    }

    setDocuments(docs);
    setLoading(false);
  };

  const renderDocument = ({ item }: { item: DocumentRecord }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.textSecondary }]} onPress={() => navigation.navigate('Viewer', { document: item })}>
      <View style={[styles.iconContainer, { backgroundColor: theme.primary + '10' }]}>
        <FileText color={theme.primary} size={28} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.docName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.docCategory, { color: theme.textSecondary }]}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

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
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryTab,
                selectedCategory === (item === 'All' ? null : item) && { backgroundColor: theme.primary }
              ]}
              onPress={() => setSelectedCategory(item === 'All' ? null : item)}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === (item === 'All' ? null : item) ? '#FFF' : theme.textSecondary }
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id?.toString() || ''}
        renderItem={renderDocument}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: theme.textSecondary }}>No documents found</Text>
          </View>
        }
      />

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
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  searchContainer: {
    margin: 20,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 10,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    borderRadius: 16,
    padding: 15,
    minHeight: 140,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  docCategory: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 40,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default HomeScreen;