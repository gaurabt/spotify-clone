'use client';

import { useState, useRef, useEffect } from 'react';
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdMusicNote } from 'react-icons/md';
import { Database } from '@/types_db';
import { createClient } from '@/libs/supabaseClient';
import { useLikedSongs } from '@/hooks/useLikedSongs';
import { useUser } from '@/hooks/useUser';
import toast from 'react-hot-toast';

type Song = Database["public"]["Tables"]["songs"]["Row"];

interface PlayerProps {
  song: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const Player: React.FC<PlayerProps> = ({ song, isPlaying, onPlayPause, onNext, onPrevious }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSongIdRef = useRef<string | number | null>(null);
  const { likedSongs, toggleLike } = useLikedSongs();
  const { user } = useUser();
  const isLiked = song ? likedSongs.some(s => s.id === song.id) : false;

  const handleLikeToggle = async () => {
    if (!user) { toast.error("Please login first"); return; }
    if (!song) return;
    await toggleLike(song);
    toast.success(isLiked ? "Removed from liked songs" : "Added to liked songs");
  };
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current || !song?.song_path) return;
    const audio = audioRef.current;

    if (song.id !== currentSongIdRef.current) {
      // New song — load src first, then play once ready
      currentSongIdRef.current = song.id;
      const supabase = createClient();
      const { data } = supabase.storage.from('songs').getPublicUrl(song.song_path);
      audio.src = data.publicUrl;
      audio.load();
      setCurrentTime(0);

      if (isPlaying) {
        const onCanPlay = () => {
          audio.removeEventListener('canplay', onCanPlay);
          audio.play().catch(err => console.error('Play error:', err));
        };
        audio.addEventListener('canplay', onCanPlay);
      }
      return;
    }

    if (isPlaying) {
      audio.play().catch(err => console.error('Play error:', err));
    } else {
      audio.pause();
    }
  }, [song, isPlaying]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.volume = newMuted ? 0 : volume;
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!song) return null;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  const progressStyle = {
    background: `linear-gradient(to right, #fff ${progressPercent}%, #535353 ${progressPercent}%)`,
  };

  const volumeStyle = {
    background: `linear-gradient(to right, #fff ${volumePercent}%, #535353 ${volumePercent}%)`,
  };

  return (
    <>
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
      />

      {/* ── MOBILE PLAYER (hidden on md+) ─────────────────────────── */}
      <div className="md:hidden w-full bg-[#181818] border-t border-[#282828]">
        {/* thin progress strip */}
        <div className="h-0.5 w-full bg-[#535353]">
          <div
            className="h-full bg-[#1db954] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3 gap-3">
          {/* album art + info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-11 h-11 bg-neutral-700 rounded shrink-0 flex items-center justify-center overflow-hidden">
              {song.image_path ? (
                <img
                  src={(() => {
                    const supabase = createClient();
                    return supabase.storage.from('images').getPublicUrl(song.image_path!).data.publicUrl;
                  })()}
                  alt={song.title ?? ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MdMusicNote size={20} className="text-neutral-500" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{song.title || 'Untitled'}</p>
              <p className="text-neutral-400 text-xs truncate">{song.author || 'Unknown Artist'}</p>
            </div>
          </div>

          {/* controls */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onPlayPause}
              className="text-white hover:scale-105 transition"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <BsFillPauseFill size={28} />
                : <BsFillPlayFill size={28} />}
            </button>
            <button
              onClick={onNext}
              className="text-neutral-400 hover:text-white transition"
              aria-label="Next"
            >
              <BiSkipNext size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP PLAYER (hidden below md) ──────────────────────── */}
      <div className="hidden md:flex w-full h-22.5 bg-[#181818] border-t border-[#282828] items-center px-4">

        {/* LEFT — song info */}
        <div className="flex items-center gap-3 w-[30%] min-w-0">
          <div className="w-14 h-14 bg-neutral-700 rounded shrink-0 flex items-center justify-center overflow-hidden">
            {song.image_path ? (
              <img
                src={(() => {
                  const supabase = createClient();
                  return supabase.storage.from('images').getPublicUrl(song.image_path!).data.publicUrl;
                })()}
                alt={song.title ?? ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <MdMusicNote size={24} className="text-neutral-500" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate hover:underline cursor-pointer">
              {song.title || 'Untitled'}
            </p>
            <p className="text-neutral-400 text-xs truncate hover:underline cursor-pointer">
              {song.author || 'Unknown Artist'}
            </p>
          </div>
          <button onClick={handleLikeToggle} className="hover:text-white transition shrink-0 ml-2" aria-label="Like">
            {isLiked
              ? <AiFillHeart size={18} className="text-red-400" />
              : <AiOutlineHeart size={18} className="text-neutral-400" />}
          </button>
        </div>

        {/* CENTER — controls + scrubber */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-[40%] mx-auto">
          {/* playback buttons */}
          <div className="flex items-center gap-5">
            <button
              onClick={onPrevious}
              className="text-neutral-400 hover:text-white transition"
              aria-label="Previous"
            >
              <BiSkipPrevious size={30} />
            </button>

            <button
              onClick={onPlayPause}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <BsFillPauseFill size={16} className="text-black" />
                : <BsFillPlayFill size={16} className="text-black ml-0.5" />}
            </button>

            <button
              onClick={onNext}
              className="text-neutral-400 hover:text-white transition"
              aria-label="Next"
            >
              <BiSkipNext size={30} />
            </button>
          </div>

          {/* scrubber */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] text-neutral-400 tabular-nums w-8 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 group h-4 flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                onChange={handleProgressChange}
                className="w-full h-1 appearance-none rounded-full cursor-pointer outline-none"
                style={progressStyle}
              />
            </div>
            <span className="text-[11px] text-neutral-400 tabular-nums w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* RIGHT — volume */}
        <div className="flex items-center justify-end gap-2 w-[30%]">
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0
              ? <HiVolumeOff size={20} />
              : <HiVolumeUp size={20} />}
          </button>
          <div className="w-24">
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 appearance-none rounded-full cursor-pointer outline-none"
              style={volumeStyle}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;
