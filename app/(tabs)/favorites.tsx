import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Heart, Play, Music, Clock } from 'lucide-react-native';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { useFavorites } from '@/hooks/useFavorites';
import { Song } from '@/types/music';

export default function FavoritesScreen() {
  const { songs, playSound } = useMusicLibrary();
  const { favorites } = useFavorites();
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);

  useEffect(() => {
    const filteredFavorites = songs.filter((song) => favorites.includes(song.id));
    setFavoriteSongs(filteredFavorites);
  }, [songs, favorites]);

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => playSound(item)}
    >
      <View style={styles.albumArt}>
        {item.albumArt ? (
          <Image source={{ uri: item.albumArt }} style={styles.albumImage} />
        ) : (
          <Music size={24} color="#666" />
        )}
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {item.artist}
        </Text>
        <View style={styles.songMeta}>
          <Text style={styles.songGenre}>{item.genre}</Text>
          <View style={styles.duration}>
            <Clock size={12} color="#666" />
            <Text style={styles.durationText}>
              {formatDuration(item.duration)}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Play size={20} color="#ff6b6b" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Heart size={48} color="#333" />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyDescription}>
        Start adding songs to your favorites by tapping the heart icon
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.songCount}>{favoriteSongs.length} songs</Text>
      </View>

      {favoriteSongs.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favoriteSongs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          style={styles.songList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
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
    marginBottom: 8,
  },
  songCount: {
    fontSize: 18,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#666',
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
  },
  songList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
    minHeight: 80,
  },
  albumArt: {
    width: 56,
    height: 56,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  songInfo: {
    flex: 1,
    gap: 6,
    paddingRight: 8,
  },
  songTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  songArtist: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 20,
  },
  songMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    flexWrap: 'wrap',
  },
  songGenre: {
    color: '#ff6b6b',
    fontSize: 11,
    fontWeight: '500',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationText: {
    color: '#666',
    fontSize: 11,
  },
  playButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
});