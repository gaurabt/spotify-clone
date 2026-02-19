'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Database } from '@/types_db';

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  play: (song: Song, playlist?: Song[]) => void;
  pause: () => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setQueue: (songs: Song[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const play = useCallback((song: Song, playlist?: Song[]) => {
    setCurrentSong(song);
    if (playlist) {
      setQueue(playlist);
      setCurrentIndex(playlist.findIndex(s => s.id === song.id));
    }
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const nextSong = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
  }, [queue, currentIndex]);

  const previousSong = useCallback(() => {
    if (queue.length === 0) return;
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentSong(queue[prevIndex]);
  }, [queue, currentIndex]);

  const value: PlayerContextType = {
    currentSong,
    isPlaying,
    queue,
    currentIndex,
    play,
    pause,
    togglePlayPause,
    nextSong,
    previousSong,
    setQueue,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};
