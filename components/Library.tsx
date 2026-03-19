'use client';

import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import SongUpload from "./SongUpload";
import SongItem from "./SongItem";
import { useSongs } from "@/hooks/useSongs";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { useUser } from "@/hooks/useUser";
import { Database } from "@/types_db";
import toast from "react-hot-toast";

type Song = Database["public"]["Tables"]["songs"]["Row"];

const Library = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { songs, isLoading } = useSongs(refreshTrigger);
  const { likedSongs, toggleLike } = useLikedSongs();
  const { user } = useUser();
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

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = () => {
    // Trigger a refresh of the songs list
    console.log('Upload successful, refreshing songs list');
    setRefreshTrigger(prev => prev + 1);
  };

  return ( 
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-5 pt-4 shrink-0">
          <div className="inline-flex items-center gap-x-2">
            <TbPlaylist className="text-neutral-400" size={26} />
            <p className="text-neutral-400 font-medium text-md">
              Your Library
            </p>
          </div>
          <AiOutlinePlus
            onClick={handleUploadClick}
            size={20}
            className="text-neutral-400 hover:text-white transition cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-y-2 mt-4 px-3 flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="text-neutral-400 text-sm">Loading songs...</div>
          ) : songs.length === 0 ? (
            <div className="text-neutral-400 text-sm">No songs yet. Click + to upload!</div>
          ) : (
            songs.map((song) => (
              <SongItem
                key={song.id}
                song={song}
                playlist={songs}
                isLiked={likedSet.has(song.id)}
                onLikeToggle={() => handleLikeToggle(song)}
              />
            ))
          )}
        </div>
      </div>
      <SongUpload 
        isOpen={isUploadModalOpen}
        onChange={setIsUploadModalOpen}
        onSuccess={handleUploadSuccess}
      />
    </>
   );
}
 
export default Library;