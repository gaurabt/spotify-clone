'use client';

import { useState, useEffect } from 'react';
import { getSongs } from '@/libs/songQueries';
import { useUser } from '@/hooks/useUser';
import { Database } from '@/types_db';

type Song = Database["public"]["Tables"]["songs"]["Row"];

export const useSongs = (refreshTrigger?: number) => {
  const { user, isLoading: isLoadingUser } = useUser();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoadingUser) return;

    if (!user) {
      setSongs([]);
      setIsLoading(false);
      return;
    }

    const fetchSongs = async () => {
      setIsLoading(true);
      const data = await getSongs();
      setSongs(data);
      setIsLoading(false);
    };

    fetchSongs();
  }, [refreshTrigger, user, isLoadingUser]);

  return { songs, isLoading };
};
