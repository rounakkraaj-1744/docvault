import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import { useTheme } from '../hooks/useTheme';
import { StorageService } from '../services/storageService';
import { EncryptionService } from '../services/encryptionService';
import { DocumentRecord } from '../database/db';
import { Trash2, Share2, ChevronLeft, ZoomIn } from 'lucide-react-native';

const ViewerScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { document } = route.params as { document: DocumentRecord };

  const [tempUri, setTempUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    decryptAndShow();
    return () => {
      if (tempUri) {
        EncryptionService.clearTempFile(tempUri);
      }
    };
  }, []);

  const decryptAndShow = async () => {
    try {
      const uri = await StorageService.viewDocument(document);
      setTempUri(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to decrypt document');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to permanently delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteDocument(document);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    if (!tempUri) return;
    try {
      await Share.open({
        url: `file://${tempUri}`,
        type: document.file_type,
        title: document.name,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const isPdf = document.file_type.includes('pdf');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={theme.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{document.name}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleShare} style={styles.headerIcon}>
            <Share2 color={theme.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.headerIcon}>
            <Trash2 color={theme.error} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.viewer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : tempUri ? (
          isPdf ? (
            <Pdf
              source={{ uri: `file://${tempUri}` }}
              style={styles.pdf}
              onError={(error) => Alert.alert('Error', 'Could not load PDF')}
            />
          ) : (
            <Image
              source={{ uri: `file://${tempUri}` }}
              style={styles.image}
              resizeMode="contain"
            />
          )
        ) : (
          <Text style={{ color: theme.textSecondary }}>Failed to load document</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 15,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 20,
  },
  viewer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ViewerScreen;
