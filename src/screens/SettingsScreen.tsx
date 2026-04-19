import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store';
import { ChevronLeft, Shield, Moon, Info, Lock } from 'lucide-react-native';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { isDarkMode, setDarkMode, biometricsEnabled, setBiometricsEnabled } = useAppStore();

  const handleChangePin = () => {
    navigation.navigate('Lock');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Security</Text>
          
          <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.rowLabel}>
              <Shield size={20} color={theme.primary} />
              <Text style={[styles.rowText, { color: theme.text }]}>Use Biometrics</Text>
            </View>
            <Switch
              value={!!biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={Platform.OS === 'android' ? theme.surface : undefined}
            />
          </View>

          <TouchableOpacity 
            style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border, marginTop: 12 }]}
            onPress={handleChangePin}
          >
            <View style={styles.rowLabel}>
              <Lock size={20} color={theme.primary} />
              <Text style={[styles.rowText, { color: theme.text }]}>Change Vault PIN</Text>
            </View>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>Update</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Preferences</Text>
          <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.rowLabel}>
              <Moon size={20} color={theme.primary} />
              <Text style={[styles.rowText, { color: theme.text }]}>Dark Appearance</Text>
            </View>
            <Switch
              value={!!isDarkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={Platform.OS === 'android' ? theme.surface : undefined}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>About</Text>
          <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.rowLabel}>
              <Info size={20} color={theme.primary} />
              <Text style={[styles.rowText, { color: theme.text }]}>App Version</Text>
            </View>
            <Text style={[styles.versionText, { color: theme.textSecondary }]}>1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.backupBtn, { borderColor: theme.primary }]}
          onPress={() => Alert.alert('Cloud Backup', 'Cloud synchronization (iCloud/Google Drive) is coming soon in the next release.')}
        >
          <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 16 }}>Export Encryption Keys</Text>
        </TouchableOpacity>

        <Text style={[styles.legalText, { color: theme.textSecondary }]}>
          DocVault ensures all your documents are stored locally and encrypted using AES-256. We never upload your data to any server.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  title: { fontSize: 22, fontWeight: '800' },
  backBtn: { padding: 4 },
  content: { padding: 20 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderRadius: 18, borderWidth: 1 },
  rowLabel: { flexDirection: 'row', alignItems: 'center' },
  rowText: { fontSize: 16, fontWeight: '600', marginLeft: 14 },
  versionText: { fontSize: 16, fontWeight: '500' },
  backupBtn: { marginTop: 8, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 18, borderWidth: 2, borderStyle: 'dotted' },
  legalText: { marginTop: 32, textAlign: 'center', fontSize: 12, lineHeight: 18, paddingHorizontal: 30, opacity: 0.8 },
});

export default SettingsScreen;
