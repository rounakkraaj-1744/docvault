import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, SafeAreaView, Share, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../hooks/useTheme';
import { StorageService } from '../services/storageService';
import { EncryptionService } from '../services/encryptionService';
import { DocumentRecord } from '../utils/types';
import { Trash2, Share2, ChevronLeft, Calendar, Tag, Shield } from 'lucide-react-native';

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
      Alert.alert('Security Error', 'Failed to decrypt document. The encryption key might be missing.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Permanent Delete',
      'Are you sure? This document is encrypted and stored locally. Once deleted, it cannot be recovered.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Permanently', 
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
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(tempUri, {
          mimeType: document.file_type,
          dialogTitle: document.name,
        });
      } else {
        await Share.share({
          message: `Shared from DocVault: ${document.name}`,
          url: tempUri,
        });
      }
    } catch (error) {
      console.log('Sharing failed', error);
    }
  };

  const isImage = document.file_type.toLowerCase().includes('image');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{document.name}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleShare} style={styles.actionIcon}>
            <Share2 color={theme.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionIcon}>
            <Trash2 color={theme.error} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.metaCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.metaRow}>
            <Tag size={16} color={theme.primary} />
            <Text style={[styles.metaText, { color: theme.text }]}>{document.category}</Text>
            <View style={{ width: 20 }} />
            <Calendar size={16} color={theme.primary} />
            <Text style={[styles.metaText, { color: theme.text }]}>
              {document.created_at ? new Date(document.created_at).toLocaleDateString() : 'Today'}
            </Text>
          </View>
        </View>

        <View style={[styles.viewer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : tempUri ? (
            isImage ? (
              <Image
                source={{ uri: tempUri }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.nonImagePlaceholder}>
                <Shield color={theme.primary} size={64} style={{ marginBottom: 20 }} />
                <Text style={[styles.placeholderTitle, { color: theme.text }]}>Secure PDF View</Text>
                <Text style={[styles.placeholderSubtitle, { color: theme.textSecondary }]}>
                  This file is decrypted in a secure sandbox.
                </Text>
                <TouchableOpacity
                  style={[styles.openBtn, { backgroundColor: theme.primary }]}
                  onPress={handleShare}
                >
                  <Text style={styles.openBtnText}>Open with System Viewer</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <Text style={{ color: theme.error }}>Decryption failed</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', flex: 1, marginHorizontal: 12 },
  backBtn: { padding: 4 },
  actions: { flexDirection: 'row' },
  actionIcon: { marginLeft: 20, padding: 4 },
  content: { flex: 1, padding: 20 },
  metaCard: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  metaText: { fontSize: 13, fontWeight: '600', marginLeft: 6 },
  viewer: { flex: 1, borderRadius: 20, borderWidth: 1, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  nonImagePlaceholder: { alignItems: 'center', padding: 40 },
  placeholderTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  placeholderSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 30, opacity: 0.7 },
  openBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  openBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});

export default ViewerScreen;
