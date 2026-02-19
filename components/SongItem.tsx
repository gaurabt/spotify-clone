'use client';

import { Database } from '@/types_db';
import Image from 'next/image';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { usePlayer } from '@/providers/PlayerProvider';

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface SongItemProps {
  song: Song;
  isLiked?: boolean;
  onLikeToggle?: () => void;
  onClick?: () => void;
  playlist?: Song[];
}

const SongItem: React.FC<SongItemProps> = ({ 
  song, 
  isLiked = false, 
  onLikeToggle,
  onClick,
  playlist
}) => {
  const { play } = usePlayer();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    play(song, playlist);
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 hover:bg-neutral-700/50 rounded-lg transition cursor-pointer group"
    >
      <div className="relative w-12 h-12 flex-shrink-0">
        {song.image_path ? (
          <Image
            src={song.image_path}
            alt={song.title || 'Song'}
            fill
            className="object-cover rounded"
          />
        ) : (
          <div className="w-full h-full bg-neutral-700 rounded flex items-center justify-center">
            <span className="text-neutral-400 text-xs">No img</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold truncate">
          {song.title || 'Untitled'}
        </h4>
        <p className="text-neutral-400 text-xs truncate">
          {song.author || 'Unknown Artist'}
        </p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle?.();
          }}
          className="hover:text-emerald-500 transition"
        >
          <FaHeart 
            size={16} 
            className={isLiked ? 'text-red-400' : 'text-neutral-400'}
          />
        </button>
        <button 
          onClick={handlePlay}
          className="bg-emerald-500 hover:bg-emerald-400 rounded-full p-2 transition"
        >
          <FaPlay size={12} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default SongItem;
