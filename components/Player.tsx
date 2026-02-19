'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { Database } from '@/types_db';

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface PlayerProps {
  song: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const Player: React.FC<PlayerProps> = ({
  song,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current || !song?.song_path) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.src = song.song_path;
      audio.play().catch(err => console.error('Play error:', err));
    } else {
      audio.pause();
    }
  }, [song, isPlaying]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!song) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-900 border-t border-neutral-800 flex items-center justify-center">
        <p className="text-neutral-400">No song playing</p>
      </div>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-4 py-3">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-neutral-400 min-w-8">
            {formatTime(currentTime)}
          </span>
          <div
            onClick={handleProgressClick}
            className="flex-1 h-1 bg-neutral-700 rounded-full cursor-pointer hover:bg-neutral-600 group"
          >
            <div
              className="h-full bg-emerald-500 rounded-full transition group-hover:bg-emerald-400"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className="text-xs text-neutral-400 min-w-8">
            {formatTime(duration)}
          </span>
        </div>

        {/* Main player controls */}
        <div className="flex items-center justify-between">
          {/* Song info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold truncate text-sm">
              {song.title || 'Untitled'}
            </h4>
            <p className="text-neutral-400 text-xs truncate">
              {song.author || 'Unknown Artist'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mx-4">
            <button
              onClick={onPrevious}
              className="text-neutral-400 hover:text-white transition"
            >
              <FaStepBackward size={16} />
            </button>
            <button
              onClick={onPlayPause}
              className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-full p-2 transition"
            >
              {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
            </button>
            <button
              onClick={onNext}
              className="text-neutral-400 hover:text-white transition"
            >
              <FaStepForward size={16} />
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2 min-w-32">
            <button
              onClick={toggleMute}
              className="text-neutral-400 hover:text-white transition"
            >
              {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-neutral-700 rounded-full cursor-pointer appearance-none accent-emerald-500"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;
