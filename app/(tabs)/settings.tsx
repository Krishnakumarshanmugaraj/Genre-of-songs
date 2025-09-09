import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Upload,
  RefreshCw,
  Settings as SettingsIcon,
  Info,
  ChevronRight,
  Folder,
  Tag,
  Trash2,
  Download,
} from 'lucide-react-native';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { useMusicUpload } from '@/hooks/useMusicUpload';

export default function SettingsScreen() {
  const { loadMusicLibrary, songs } = useMusicLibrary();
  const { 
    uploadMultipleFiles, 
    isUploading, 
    uploadProgress, 
    clearUploadedSongs,
    scanDeviceMusic,
    requestPermissions 
  } = useMusicUpload();

  const handleUploadMusic = async () => {
    try {
      const uploadedSongs = await uploadMultipleFiles();
      if (uploadedSongs.length > 0) {
        // Refresh the library to show new songs
        await loadMusicLibrary();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleScanDevice = async () => {
    try {
      await requestPermissions();
      await loadMusicLibrary();
    } catch (error) {
      console.error('Device scan failed:', error);
    }
  };

  const handleClearLibrary = async () => {
    try {
      await clearUploadedSongs();
      await loadMusicLibrary();
    } catch (error) {
      console.error('Clear library failed:', error);
    }
  };
  const settingsSections = [
    {
      title: 'Library Management',
      items: [
        {
          icon: Upload,
          label: 'Import Music',
          description: 'Add music files to your library',
          onPress: handleUploadMusic,
          loading: isUploading,
        },
        {
          icon: Download,
          label: 'Scan Device Music',
          description: 'Find music files on your device',
          onPress: handleScanDevice,
        },
        {
          icon: RefreshCw,
          label: 'Refresh Library',
          description: 'Scan for new music files',
          onPress: loadMusicLibrary,
        },
        {
          icon: Trash2,
          label: 'Clear Library',
          description: 'Remove all uploaded songs',
          onPress: handleClearLibrary,
        },
        {
          icon: Tag,
          label: 'Manage Genres',
          description: 'Edit and organize genre tags',
          onPress: () => {},
        },
        {
          icon: Folder,
          label: 'Storage Settings',
          description: 'Configure music storage location',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Application',
      items: [
        {
          icon: SettingsIcon,
          label: 'Preferences',
          description: 'App settings and configurations',
          onPress: () => {},
        },
        {
          icon: Info,
          label: 'About',
          description: 'App information and version',
          onPress: () => {},
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.label}
      style={styles.settingItem}
      onPress={item.loading ? undefined : item.onPress}
      disabled={item.loading}
    >
      <View style={styles.settingIcon}>
        <item.icon size={24} color="#ff6b6b" />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>
          {item.label}
          {item.loading && ' (Processing...)'}
        </Text>
        <Text style={styles.settingDescription}>
          {item.loading ? `Progress: ${Math.round(uploadProgress)}%` : item.description}
        </Text>
      </View>
      <ChevronRight size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Library Statistics</Text>
          {isUploading && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Uploading: {Math.round(uploadProgress)}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          )}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{songs.length}</Text>
              <Text style={styles.statLabel}>Total Songs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Set(songs.map(song => song.genre)).size}
              </Text>
              <Text style={styles.statLabel}>Genres</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Set(songs.map(song => song.artist)).size}
              </Text>
              <Text style={styles.statLabel}>Artists</Text>
            </View>
          </View>
        </View>

        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionItems}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsCard: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 18,
    borderRadius: 16,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#ff6b6b',
    fontSize: 26,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '600',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  sectionItems: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    gap: 12,
    minHeight: 72,
  },
  settingIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    gap: 6,
    paddingRight: 8,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  settingDescription: {
    color: '#666',
    fontSize: 15,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff6b6b',
  },
});