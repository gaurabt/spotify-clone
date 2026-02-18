'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SongCard from '@/components/SongCard';
import { searchSongs, isSongLiked, addLikedSong, removeLikedSong } from '@/libs/songQueries';
import { useUser } from '@/hooks/useUser';
import { Database } from '@/types_db';
import toast from 'react-hot-toast';

type Song = Database["public"]["Tables"]["songs"]["Row"];

export default function SearchPage() {
  const router = useRouter();
  const { user } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const songs = await searchSongs(query);
      setResults(songs);
      setIsSearching(false);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const loadLikedSongs = async () => {
      if (!user) return;

      const liked = new Set<string>();
      for (const song of results) {
        const isLiked = await isSongLiked(user.id, song.id);
        if (isLiked) {
          liked.add(song.id);
        }
      }
      setLikedSongs(liked);
    };

    loadLikedSongs();
  }, [results, user]);

  const handleLikeToggle = async (songId: string) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    const isLiked = likedSongs.has(songId);
    const newLikedSongs = new Set(likedSongs);

    if (isLiked) {
      newLikedSongs.delete(songId);
      await removeLikedSong(user.id, songId);
      toast.success('Removed from liked songs');
    } else {
      newLikedSongs.add(songId);
      await addLikedSong(user.id, songId);
      toast.success('Added to liked songs');
    }

    setLikedSongs(newLikedSongs);
  };

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold mb-4">
            Search
          </h1>
          <input
            type="text"
            placeholder="Search songs or artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 bg-neutral-800 text-white rounded-full placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        {query && (
          <div>
            <h2 className="text-white text-2xl font-semibold mb-4">
              Results
            </h2>
            {isSearching ? (
              <div className="text-neutral-400">Searching...</div>
            ) : results.length === 0 ? (
              <div className="text-neutral-400">No songs found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                {results.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    isLiked={likedSongs.has(song.id)}
                    onLikeToggle={() => handleLikeToggle(song.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        {!query && (
          <div className="text-neutral-400">
            Start typing to search for songs or artists
          </div>
        )}
      </div>
    </div>
  );
}
