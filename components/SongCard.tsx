'use client';

import { Database } from '@/types_db';
import Image from 'next/image';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { usePlayer } from '@/providers/PlayerProvider';

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface SongCardProps {
  song: Song;
  isLiked?: boolean;
  onLikeToggle?: () => void;
  playlist?: Song[];
}

const SongCard: React.FC<SongCardProps> = ({ song, isLiked = false, onLikeToggle, playlist }) => {
  const { play } = usePlayer();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    play(song, playlist);
  };

  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden hover:bg-neutral-700/50 transition cursor-pointer group p-4">
      <div className="relative mb-4 aspect-square overflow-hidden rounded-md">
        {song.image_path ? (
          <Image
            src={song.image_path}
            alt={song.title || 'Song'}
            fill
            className="object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
            <span className="text-neutral-400">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
          <button
            onClick={handlePlay}
            className="bg-emerald-500 hover:bg-emerald-400 rounded-full p-3 transition"
          >
            <FaPlay size={16} className="text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle?.();
            }}
            className="bg-neutral-700 hover:bg-neutral-600 rounded-full p-3 transition"
          >
            <FaHeart 
              size={16} 
              className={isLiked ? 'text-red-400' : 'text-white'}
            />
          </button>
        </div>
      </div>
      <h3 className="text-white font-semibold truncate">
        {song.title || 'Untitled'}
      </h3>
      <p className="text-neutral-400 text-sm truncate">
        {song.author || 'Unknown Artist'}
      </p>
    </div>
  );
};

export default SongCard;
