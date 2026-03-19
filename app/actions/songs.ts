'use server';

import { createSupabaseServerClient } from '@/libs/supabaseServerClient';

async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { supabase: null, user: null };
  return { supabase, user };
}

export async function likeSongAction(songId: string): Promise<{ error?: string }> {
  if (!songId || typeof songId !== 'string' || songId.length > 100) {
    return { error: 'Invalid song ID' };
  }

  const { supabase, user } = await getAuthenticatedUser();
  if (!supabase || !user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('liked songs')
    .insert({ user_id: user.id, song_id: songId });

  return { error: error?.message };
}

export async function unlikeSongAction(songId: string): Promise<{ error?: string }> {
  if (!songId || typeof songId !== 'string' || songId.length > 100) {
    return { error: 'Invalid song ID' };
  }

  const { supabase, user } = await getAuthenticatedUser();
  if (!supabase || !user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('liked songs')
    .delete()
    .eq('user_id', user.id)
    .eq('song_id', songId);

  return { error: error?.message };
}

export async function insertSongAction(
  title: string,
  author: string,
  songPath: string
): Promise<{ error?: string }> {
  const trimmedTitle = title?.trim().slice(0, 200);
  const trimmedAuthor = author?.trim().slice(0, 200);

  if (!trimmedTitle || !trimmedAuthor || !songPath) {
    return { error: 'Invalid input' };
  }

  const { supabase, user } = await getAuthenticatedUser();
  if (!supabase || !user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('songs').insert({
    title: trimmedTitle,
    author: trimmedAuthor,
    song_path: songPath,
    user_id: user.id,
  });

  return { error: error?.message };
}
