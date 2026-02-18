'use client';

import { useState, useEffect } from 'react';
import { getUserLikedSongs, addLikedSong, removeLikedSong } from '@/libs/songQueries';
import { useUser } from './useUser';
import { Database } from '@/types_db';

type Song = Database["public"]["Tables"]["songs"]["Row"];

export const useLikedSongs = () => {
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

  const toggleLike = async (songId: string, isLiked: boolean) => {
    if (!user) return;

    if (isLiked) {
      await removeLikedSong(user.id, songId);
      setLikedSongs(prev => prev.filter(song => song.id !== songId));
    } else {
      await addLikedSong(user.id, songId);
      const newSong = likedSongs.find(s => s.id === songId);
      if (newSong) {
        setLikedSongs(prev => [newSong, ...prev]);
      }
    }
  };

  return { likedSongs, isLoading, toggleLike };
};
