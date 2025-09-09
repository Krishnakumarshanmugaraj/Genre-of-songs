import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '@/types/music';
import { useMusicUpload } from './useMusicUpload';

export function useMusicLibrary() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const { getUploadedSongs, scanDeviceMusic } = useMusicUpload();

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const loadMusicLibrary = async () => {
    setIsLoading(true);
    try {
      // Load uploaded songs
      const uploadedSongs = await getUploadedSongs();
      
      // Try to scan device music (requires permission)
      let deviceSongs: Song[] = [];
      try {
        deviceSongs = await scanDeviceMusic();
      } catch (error) {
        console.log('Device scan not available, using uploaded songs only');
      }
      
      // Combine uploaded and device songs
      const allSongs = [...uploadedSongs, ...deviceSongs];
      
      // If no songs found, generate sample data for demo
      const finalSongs = allSongs.length > 0 ? allSongs : generateSampleSongs();
      
      setSongs(finalSongs);
      await AsyncStorage.setItem('musicLibrary', JSON.stringify(finalSongs));
    } catch (error) {
      console.error('Error loading music library:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playSound = async (song: Song) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      // Use the actual song URI for uploaded files
      const audioSource = song.uri.startsWith('file://') || song.uri.startsWith('content://') 
        ? { uri: song.uri }
        : { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3' }; // Fallback for demo songs

      const { sound: newSound } = await Audio.Sound.createAsync(audioSource, { shouldPlay: true });

      setSound(newSound);
      setCurrentSong(song);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeSound = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return {
    songs,
    currentSong,
    isPlaying,
    isLoading,
    loadMusicLibrary,
    playSound,
    pauseSound,
    resumeSound,
    stopSound,
  };
}

// Generate sample songs for demo
function generateSampleSongs(): Song[] {
  const genres = ['Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Country', 'Blues'];
  const artists = ['The Beatles', 'Pink Floyd', 'Led Zeppelin', 'Queen', 'Drake', 'Taylor Swift', 'Kendrick Lamar', 'Adele'];
  const albums = ['Abbey Road', 'Dark Side of the Moon', 'Led Zeppelin IV', 'A Night at the Opera', 'Views', '1989', 'DAMN.', '25'];

  const sampleSongs: Song[] = [];

  for (let i = 1; i <= 50; i++) {
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const artist = artists[Math.floor(Math.random() * artists.length)];
    const album = albums[Math.floor(Math.random() * albums.length)];
    
    sampleSongs.push({
      id: `song-${i}`,
      title: `Sample Song ${i}`,
      artist,
      album,
      genre,
      duration: Math.floor(Math.random() * 300000) + 120000, // 2-5 minutes
      uri: `file://path/to/song${i}.mp3`,
      year: Math.floor(Math.random() * 30) + 1994,
      trackNumber: Math.floor(Math.random() * 15) + 1,
    });
  }

  return sampleSongs;
}