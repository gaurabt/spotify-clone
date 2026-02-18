'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSongs } from '@/libs/songQueries';
import { Database } from '@/types_db';

type Song = Database["public"]["Tables"]["songs"]["Row"];

export const useSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      const data = await getSongs();
      setSongs(data);
      setIsLoading(false);
    };

    fetchSongs();
  }, []);

  return { songs, isLoading };
};
