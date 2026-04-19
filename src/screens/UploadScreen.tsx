import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../hooks/useTheme';
import { StorageService } from '../services/storageService';
import { DOCUMENT_CATEGORIES } from '../constants/categories';
import { FileUp, Camera, Image as ImageIcon, ChevronLeft, Check } from 'lucide-react-native';

const UploadScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState(DOCUMENT_CATEGORIES[10]); // Default to 'Other'
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
      Alert.alert('Permission Denied', 'Camera access is required to take photos');
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
      Alert.alert('Error', 'Please provide a name and select a file');
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
      Alert.alert('Success', 'Document saved securely');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={theme.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Add Document</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Document Name</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            placeholder="e.g. My PAN Card"
            placeholderTextColor={theme.textSecondary}
            value={docName}
            onChangeText={setDocName}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Source</Text>
          <View style={styles.sourceRow}>
            <TouchableOpacity 
              style={[styles.sourceBtn, { backgroundColor: theme.surface }]} 
              onPress={handlePickDocument}
            >
              <FileUp color={theme.primary} size={24} />
              <Text style={[styles.sourceText, { color: theme.text }]}>File</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sourceBtn, { backgroundColor: theme.surface }]} 
              onPress={handleCapture}
            >
              <Camera color={theme.primary} size={24} />
              <Text style={[styles.sourceText, { color: theme.text }]}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sourceBtn, { backgroundColor: theme.surface }]} 
              onPress={handleImageLibrary}
            >
              <ImageIcon color={theme.primary} size={24} />
              <Text style={[styles.sourceText, { color: theme.text }]}>Gallery</Text>
            </TouchableOpacity>
          </View>
          {tempFile && (
            <View style={[styles.fileStatus, { backgroundColor: theme.success + '20' }]}>
              <Check color={theme.success} size={16} />
              <Text style={[styles.fileStatusText, { color: theme.success }]}>File Selected</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Category</Text>
          <View style={styles.categoryGrid}>
            {DOCUMENT_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryItem,
                  { borderColor: theme.border, backgroundColor: theme.surface },
                  category === cat && { borderColor: theme.primary, backgroundColor: theme.primary + '10' }
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryIconText,
                  { color: category === cat ? theme.primary : theme.text }
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveBtn, 
            { backgroundColor: theme.primary },
            (!docName || !tempFile || isUploading) && { opacity: 0.5 }
          ]}
          disabled={!docName || !tempFile || isUploading}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>
            {isUploading ? 'Securing...' : 'Save to Vault'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  title: { fontSize: 20, fontWeight: '700' },
  content: { padding: 20 },
  section: { marginBottom: 25 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { height: 55, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  sourceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sourceBtn: { flex: 1, marginHorizontal: 5, height: 80, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 1 },
  sourceText: { marginTop: 8, fontSize: 12, fontWeight: '600' },
  fileStatus: { flexDirection: 'row', alignItems: 'center', marginTop: 15, padding: 10, borderRadius: 8, justifyContent: 'center' },
  fileStatusText: { marginLeft: 8, fontSize: 14, fontWeight: '600' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  categoryItem: { width: '47%', margin: '1.5%', padding: 12, borderRadius: 10, borderWidth: 1, alignItems: 'flex-start' },
  categoryIconText: { fontSize: 13, fontWeight: '500' },
  footer: { padding: 20 },
  saveBtn: { height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});

export default UploadScreen;
