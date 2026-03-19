'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getUserLikedSongs } from '@/libs/songQueries';
import { likeSongAction, unlikeSongAction } from '@/app/actions/songs';
import { useUser } from '@/hooks/useUser';
import { Database } from '@/types_db';

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface LikedSongsContextType {
  likedSongs: Song[];
  isLoading: boolean;
  toggleLike: (song: Song) => Promise<void>;
}

const LikedSongsContext = createContext<LikedSongsContextType | undefined>(undefined);

export const LikedSongsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLikedSongs([]);
      setIsLoading(false);
      return;
    }

    const fetchLikedSongs = async () => {
      setIsLoading(true);
      const data = await getUserLikedSongs(user.id);
      setLikedSongs(data);
      setIsLoading(false);
    };

    fetchLikedSongs();
  }, [user]);

  const toggleLike = async (song: Song) => {
    if (!user) return;
    const isLiked = likedSongs.some(s => s.id === song.id);

    // Optimistic update
    if (isLiked) {
      setLikedSongs(prev => prev.filter(s => s.id !== song.id));
      const { error } = await unlikeSongAction(song.id);
      if (error) setLikedSongs(prev => [song, ...prev]); // revert on failure
    } else {
      setLikedSongs(prev => [song, ...prev]);
      const { error } = await likeSongAction(song.id);
      if (error) setLikedSongs(prev => prev.filter(s => s.id !== song.id)); // revert on failure
    }
  };

  return (
    <LikedSongsContext.Provider value={{ likedSongs, isLoading, toggleLike }}>
      {children}
    </LikedSongsContext.Provider>
  );
};

export const useLikedSongs = () => {
  const context = useContext(LikedSongsContext);
  if (!context) throw new Error('useLikedSongs must be used within LikedSongsProvider');
  return context;
};
