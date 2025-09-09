import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '@/types/music';

const MUSIC_LIBRARY_KEY = 'uploadedMusicLibrary';

export function useMusicUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  };

  const extractMetadata = (filename: string): Partial<Song> => {
    // Basic metadata extraction from filename
    // Format: "Artist - Title.mp3" or "Title.mp3"
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const parts = nameWithoutExt.split(' - ');
    
    if (parts.length >= 2) {
      return {
        artist: parts[0].trim(),
        title: parts[1].trim(),
      };
    }
    
    return {
      title: nameWithoutExt.trim(),
      artist: 'Unknown Artist',
    };
  };

  const detectGenre = (filename: string, artist: string): string => {
    const text = `${filename} ${artist}`.toLowerCase();
    
    // Simple genre detection based on keywords
    if (text.includes('rock') || text.includes('metal') || text.includes('punk')) return 'Rock';
    if (text.includes('pop') || text.includes('dance')) return 'Pop';
    if (text.includes('hip') || text.includes('rap') || text.includes('trap')) return 'Hip-Hop';
    if (text.includes('jazz') || text.includes('blues')) return 'Jazz';
    if (text.includes('classical') || text.includes('symphony')) return 'Classical';
    if (text.includes('electronic') || text.includes('edm') || text.includes('techno')) return 'Electronic';
    if (text.includes('country') || text.includes('folk')) return 'Country';
    if (text.includes('reggae')) return 'Reggae';
    if (text.includes('indie') || text.includes('alternative')) return 'Alternative';
    
    return 'Unknown';
  };

  const uploadSingleFile = async (file: DocumentPicker.DocumentPickerAsset): Promise<Song> => {
    const metadata = extractMetadata(file.name);
    const genre = detectGenre(file.name, metadata.artist || '');
    
    // Create a unique ID for the song
    const songId = `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real app, you would copy the file to app's document directory
    // For now, we'll use the original URI
    const song: Song = {
      id: songId,
      title: metadata.title || file.name,
      artist: metadata.artist || 'Unknown Artist',
      album: 'Uploaded Music',
      genre,
      duration: 180000, // Default 3 minutes - would be extracted from actual file
      uri: file.uri,
      year: new Date().getFullYear(),
      trackNumber: 1,
    };

    return song;
  };

  const uploadMultipleFiles = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission required');
      }

      // Pick multiple audio files
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsUploading(false);
        return [];
      }

      const files = Array.isArray(result.assets) ? result.assets : [result.assets];
      const uploadedSongs: Song[] = [];

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress((i / files.length) * 100);

        try {
          const song = await uploadSingleFile(file);
          uploadedSongs.push(song);
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
        }
      }

      // Save to AsyncStorage
      const existingSongs = await getUploadedSongs();
      const allSongs = [...existingSongs, ...uploadedSongs];
      await AsyncStorage.setItem(MUSIC_LIBRARY_KEY, JSON.stringify(allSongs));

      setUploadProgress(100);
      return uploadedSongs;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getUploadedSongs = async (): Promise<Song[]> => {
    try {
      const stored = await AsyncStorage.getItem(MUSIC_LIBRARY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading uploaded songs:', error);
      return [];
    }
  };

  const clearUploadedSongs = async () => {
    try {
      await AsyncStorage.removeItem(MUSIC_LIBRARY_KEY);
    } catch (error) {
      console.error('Error clearing uploaded songs:', error);
    }
  };

  const scanDeviceMusic = async (): Promise<Song[]> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission required');
      }

      // Get all audio files from device
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 1000, // Adjust based on your needs
      });

      const deviceSongs: Song[] = [];

      for (const asset of media.assets) {
        const song: Song = {
          id: asset.id,
          title: asset.filename.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown Artist',
          album: asset.albumId || 'Unknown Album',
          genre: 'Unknown',
          duration: asset.duration * 1000, // Convert to milliseconds
          uri: asset.uri,
          year: new Date(asset.creationTime).getFullYear(),
          trackNumber: 1,
        };

        deviceSongs.push(song);
      }

      return deviceSongs;
    } catch (error) {
      console.error('Error scanning device music:', error);
      return [];
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadMultipleFiles,
    getUploadedSongs,
    clearUploadedSongs,
    scanDeviceMusic,
    requestPermissions,
  };
}