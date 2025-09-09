import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Music, ChevronRight } from 'lucide-react-native';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { Genre } from '@/types/music';

const GENRE_COLORS = {
  Rock: '#e74c3c',
  Pop: '#9b59b6',
  'Hip-Hop': '#f39c12',
  Jazz: '#2ecc71',
  Classical: '#3498db',
  Electronic: '#1abc9c',
  Country: '#e67e22',
  Blues: '#34495e',
  Reggae: '#27ae60',
  Folk: '#8e44ad',
  Alternative: '#e74c3c',
  Indie: '#f1c40f',
  Metal: '#95a5a6',
  Punk: '#c0392b',
  RnB: '#9b59b6',
  Soul: '#e67e22',
  Funk: '#f39c12',
  Unknown: '#7f8c8d',
};

export default function GenresScreen() {
  const { songs, loadMusicLibrary } = useMusicLibrary();
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    loadMusicLibrary();
  }, []);

  useEffect(() => {
    const genreMap = new Map<string, number>();
    
    songs.forEach((song) => {
      const genre = song.genre || 'Unknown';
      genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
    });

    const genreList: Genre[] = Array.from(genreMap.entries()).map(([name, count]) => ({
      name,
      count,
      color: GENRE_COLORS[name as keyof typeof GENRE_COLORS] || GENRE_COLORS.Unknown,
    }));

    genreList.sort((a, b) => b.count - a.count);
    setGenres(genreList);
  }, [songs]);

  const renderGenreItem = ({ item }: { item: Genre }) => (
    <TouchableOpacity style={[styles.genreItem, { borderLeftColor: item.color }]}>
      <View style={[styles.genreIcon, { backgroundColor: item.color }]}>
        <Music size={24} color="#fff" />
      </View>
      <View style={styles.genreInfo}>
        <Text style={styles.genreName}>{item.name}</Text>
        <Text style={styles.genreCountText}>{item.count} songs</Text>
      </View>
      <ChevronRight size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Genres</Text>
        <Text style={styles.genreCount}>{genres.length} genres found</Text>
      </View>

      <FlatList
        data={genres}
        renderItem={renderGenreItem}
        keyExtractor={(item) => item.name}
        style={styles.genreList}
        showsVerticalScrollIndicator={false}
      />
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
  genreCount: {
    fontSize: 18,
    color: '#666',
  },
  genreList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  genreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    gap: 12,
    minHeight: 80,
  },
  genreIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreInfo: {
    flex: 1,
    gap: 6,
    paddingRight: 8,
  },
  genreName: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
    lineHeight: 24,
  },
  genreCountText: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 20,
  },
});