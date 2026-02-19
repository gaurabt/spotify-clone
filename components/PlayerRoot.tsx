'use client';

import { usePlayer } from '@/providers/PlayerProvider';
import Player from '@/components/Player';

export default function PlayerRoot() {
  const { currentSong, isPlaying, togglePlayPause, nextSong, previousSong } = usePlayer();
  
  return (
    <Player
      song={currentSong}
      isPlaying={isPlaying}
      onPlayPause={togglePlayPause}
      onNext={nextSong}
      onPrevious={previousSong}
    />
  );
}
