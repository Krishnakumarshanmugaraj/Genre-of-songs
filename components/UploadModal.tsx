import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Upload, Music, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useMusicUpload } from '@/hooks/useMusicUpload';

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export default function UploadModal({ visible, onClose, onUploadComplete }: UploadModalProps) {
  const { uploadMultipleFiles, isUploading, uploadProgress } = useMusicUpload();
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleUpload = async () => {
    try {
      const uploadedSongs = await uploadMultipleFiles();
      if (uploadedSongs.length > 0) {
        setUploadComplete(true);
        onUploadComplete();
        setTimeout(() => {
          setUploadComplete(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Upload Error', 'Failed to upload music files. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Upload Music</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.uploadSection}>
            <View style={styles.iconContainer}>
              {uploadComplete ? (
                <CheckCircle size={64} color="#4CAF50" />
              ) : (
                <Music size={64} color="#ff6b6b" />
              )}
            </View>

            {uploadComplete ? (
              <View style={styles.successContainer}>
                <Text style={styles.successTitle}>Upload Complete!</Text>
                <Text style={styles.successDescription}>
                  Your music has been successfully added to the library
                </Text>
              </View>
            ) : (
              <View style={styles.uploadContainer}>
                <Text style={styles.uploadTitle}>Add Your Music Collection</Text>
                <Text style={styles.uploadDescription}>
                  Select multiple audio files from your device to add them to your music library.
                  Supported formats: MP3, M4A, WAV, FLAC
                </Text>

                {isUploading && (
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                      Uploading... {Math.round(uploadProgress)}%
                    </Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
                  onPress={handleUpload}
                  disabled={isUploading}
                >
                  <Upload size={24} color="#fff" />
                  <Text style={styles.uploadButtonText}>
                    {isUploading ? 'Processing...' : 'Select Music Files'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>How it works:</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoItem}>• Select multiple audio files at once</Text>
              <Text style={styles.infoItem}>• Automatic genre detection based on filename</Text>
              <Text style={styles.infoItem}>• Metadata extraction for artist and title</Text>
              <Text style={styles.infoItem}>• Files are organized by genre automatically</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  uploadSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  uploadContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  uploadDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff6b6b',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  uploadButtonDisabled: {
    backgroundColor: '#666',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 22,
  },
});