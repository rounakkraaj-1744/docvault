import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../hooks/useTheme';
import { StorageService } from '../services/storageService';
import { DOCUMENT_CATEGORIES } from '../utils/constants';
import { VaultInput } from '../components/VaultInput';
import { ActionButton } from '../components/ActionButton';
import { CategoryChip } from '../components/CategoryChip';
import { FileUp, Camera, Image as ImageIcon, ChevronLeft, CheckCircle2 } from 'lucide-react-native';

const UploadScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState(DOCUMENT_CATEGORIES[10]);
  const [tempFile, setTempFile] = useState<{ uri: string, type: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setTempFile({ uri: asset.uri, type: asset.mimeType || 'application/octet-stream' });
        if (!docName) setDocName(asset.name || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'DocVault needs camera access to scan physical documents.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setTempFile({ uri: result.assets[0].uri, type: 'image/jpeg' });
    }
  };

  const handleImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setTempFile({ uri: result.assets[0].uri, type: 'image/jpeg' });
    }
  };

  const handleSave = async () => {
    if (!docName || !tempFile) {
      Alert.alert('Missing Information', 'Please provide a file name and select a document.');
      return;
    }

    setIsUploading(true);
    try {
      await StorageService.saveDocument(
        tempFile.uri,
        docName,
        category,
        tempFile.type
      );
      Alert.alert('Vault Secured', 'Your document has been encrypted and stored safely.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Storage Error', 'Vault encryption failed. Ensure you have enough storage space.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Add to Vault</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <VaultInput
          label="Document Label"
          placeholder="e.g. Health Insurance 2024"
          value={docName}
          onChangeText={setDocName}
        />

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Import Source</Text>
          <View style={styles.sourceRow}>
            <TouchableOpacity style={[styles.sourceBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={handlePickDocument}>
              <FileUp color={theme.primary} size={26} />
              <Text style={[styles.sourceText, { color: theme.text }]}>Files</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sourceBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={handleCapture}>
              <Camera color={theme.primary} size={26} />
              <Text style={[styles.sourceText, { color: theme.text }]}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sourceBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={handleImageLibrary}>
              <ImageIcon color={theme.primary} size={26} />
              <Text style={[styles.sourceText, { color: theme.text }]}>Photos</Text>
            </TouchableOpacity>
          </View>
          {!!tempFile && (
            <View style={[styles.fileIndicator, { backgroundColor: theme.success + '15' }]}>
              <CheckCircle2 color={theme.success} size={20} />
              <Text style={[styles.fileIndicatorText, { color: theme.success }]}>Document Loaded & Ready</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Select Category</Text>
          <View style={styles.categoryGrid}>
            {DOCUMENT_CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                selected={category === cat}
                onPress={() => setCategory(cat)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          label="Encrypt & Store Safely"
          onPress={handleSave}
          loading={isUploading}
          disabled={!docName || !tempFile}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { padding: 4 },
  title: { fontSize: 22, fontWeight: '800' },
  content: { padding: 22 },
  section: { marginBottom: 30 },
  label: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  sourceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sourceBtn: { flex: 1, marginHorizontal: 6, height: 90, borderRadius: 18, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  sourceText: { marginTop: 10, fontSize: 13, fontWeight: '700' },
  fileIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 16, padding: 14, borderRadius: 14, justifyContent: 'center' },
  fileIndicatorText: { marginLeft: 10, fontSize: 14, fontWeight: '700' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  footer: { padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
});

export default UploadScreen;
