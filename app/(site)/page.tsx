'use client';

import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import SongCard from "@/components/SongCard";
import { useSongs } from "@/hooks/useSongs";
import { useUser } from "@/hooks/useUser";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { Database } from "@/types_db";
import toast from "react-hot-toast";

type Song = Database["public"]["Tables"]["songs"]["Row"];

export default function Home() {
  const { songs, isLoading } = useSongs();
  const { user } = useUser();
  const { likedSongs, toggleLike } = useLikedSongs();
  const likedSet = new Set(likedSongs.map(s => s.id));

  const handleLikeToggle = async (song: Song) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    const isLiked = likedSet.has(song.id);
    await toggleLike(song);
    toast.success(isLiked ? "Removed from liked songs" : "Added to liked songs");
  };

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
            Welcome back
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem 
              image="/images/liked.png"
              name="Liked Songs"
              href="liked"
            />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white text-2xl font-semibold">
            New Releases
          </h1>
        </div>
        {isLoading ? (
          <div className="text-neutral-400">Loading songs...</div>
        ) : songs.length === 0 ? (
          <div className="text-neutral-400">No songs available yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isLiked={likedSet.has(song.id)}
                onLikeToggle={() => handleLikeToggle(song)}
                playlist={songs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
