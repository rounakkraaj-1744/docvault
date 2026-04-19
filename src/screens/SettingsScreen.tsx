import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useAppStore, useAuthStore } from '../store';
import { ChevronLeft, Shield, Moon, Bell, Info } from 'lucide-react-native';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { isDarkMode, setDarkMode, biometricsEnabled, setBiometricsEnabled } = useAppStore();
  const { hasPin } = useAuthStore();

  const handleChangePin = () => {
    navigation.navigate('Lock', { isResetting: true });
    // Note: I would need to modify LockScreen to handle resetting, 
    // but for now the user can just re-enter.
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={theme.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Security</Text>
          <View style={[styles.settingRow, { backgroundColor: theme.surface }]}>
            <View style={styles.settingLabel}>
              <Shield size={20} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Use Biometrics</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
          <TouchableOpacity 
            style={[styles.settingRow, { backgroundColor: theme.surface, marginTop: 1 }]}
            onPress={handleChangePin}
          >
            <View style={styles.settingLabel}>
              <Text style={[styles.settingText, { color: theme.text }]}>Update PIN</Text>
            </View>
            <Text style={{ color: theme.primary }}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
          <View style={[styles.settingRow, { backgroundColor: theme.surface }]}>
            <View style={styles.settingLabel}>
              <Moon size={20} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>About</Text>
          <View style={[styles.settingRow, { backgroundColor: theme.surface }]}>
            <View style={styles.settingLabel}>
              <Info size={20} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Version</Text>
            </View>
            <Text style={{ color: theme.textSecondary }}>1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.backupBtn}
          onPress={() => Alert.alert('Coming Soon', 'Cloud backup (Supabase/Google Drive) will be available in the next update.')}
        >
          <Text style={{ color: theme.primary, fontWeight: '700' }}>Export Local Backup</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  backupBtn: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2563EB',
  },
});

export default SettingsScreen;
