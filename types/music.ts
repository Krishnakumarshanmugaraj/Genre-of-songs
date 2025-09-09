export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  uri: string;
  albumArt?: string;
  year?: number;
  trackNumber?: number;
}

export interface Genre {
  name: string;
  count: number;
  color: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicLibraryState {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  isLoading: boolean;
}