import { createClient } from "./supabaseClient";
import { Database } from "@/types_db";

type Song = Database["public"]["Tables"]["songs"]["Row"];

export const getSongs = async (): Promise<Song[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching songs:", error);
    return [];
  }

  return data || [];
};

export const getSongById = async (id: string): Promise<Song | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching song:", error);
    return null;
  }

  return data;
};

export const searchSongs = async (query: string): Promise<Song[]> => {
  const sanitized = query.trim().slice(0, 100);
  if (!sanitized) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .or(`title.ilike.%${sanitized}%,author.ilike.%${sanitized}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching songs:", error);
    return [];
  }

  return data || [];
};

export const getUserLikedSongs = async (userId: string): Promise<Song[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("liked songs")
    .select("song_id, songs(*)")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching liked songs:", error);
    return [];
  }

  return data?.map((item: any) => item.songs).filter(Boolean) || [];
};

export const isSongLiked = async (
  userId: string,
  songId: string
): Promise<boolean> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("liked songs")
    .select("*")
    .eq("user_id", userId)
    .eq("song_id", songId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
};

export const addLikedSong = async (
  userId: string,
  songId: string
): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase.from("liked songs").insert({
    user_id: userId,
    song_id: songId,
  });

  if (error) {
    console.error("Error adding liked song:", error);
    return false;
  }

  return true;
};

export const removeLikedSong = async (
  userId: string,
  songId: string
): Promise<boolean> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("liked songs")
    .delete()
    .eq("user_id", userId)
    .eq("song_id", songId);

  if (error) {
    console.error("Error removing liked song:", error);
    return false;
  }

  return true;
};
