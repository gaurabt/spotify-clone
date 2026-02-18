'use client';

import Header from '@/components/Header';
import SongItem from '@/components/SongItem';
import { useLikedSongs } from '@/hooks/useLikedSongs';
import { useUser } from '@/hooks/useUser';
import useAuthModal from '@/hooks/useAuthModal';
import { removeLikedSong } from '@/libs/songQueries';
import toast from 'react-hot-toast';

export default function LikedPage() {
  const { likedSongs, isLoading, toggleLike } = useLikedSongs();
  const { user } = useUser();
  const authModal = useAuthModal();

  if (!user) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-3xl font-semibold mb-4">
            Your Liked Songs
          </h1>
          <p className="text-neutral-400 mb-6">
            Log in to see your liked songs
          </p>
          <button
            onClick={authModal.onOpen}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-full font-semibold transition"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
            Liked Songs
          </h1>
          <p className="text-neutral-400 mt-2">
            {likedSongs.length} song{likedSongs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        {isLoading ? (
          <div className="text-neutral-400">Loading...</div>
        ) : likedSongs.length === 0 ? (
          <div className="text-neutral-400">
            No liked songs yet. Add songs to your collection!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {likedSongs.map((song) => (
              <SongItem
                key={song.id}
                song={song}
                isLiked={true}
                onLikeToggle={() => toggleLike(song.id, true)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
