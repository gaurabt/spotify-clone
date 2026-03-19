'use client';

import React, { useState } from 'react';
import { createClient } from '@/libs/supabaseClient';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { useUser } from '@/hooks/useUser';
import { insertSongAction } from '@/app/actions/songs';

const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/mp4'];
const MAX_FILE_SIZE_MB = 50;

interface SongUploadProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const SongUpload: React.FC<SongUploadProps> = ({ isOpen, onChange, onSuccess }) => {
  const supabase = createClient();
  const { user } = useUser();
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!songTitle || !artist || !file) {
      toast.error('Please fill in all fields and select a file.');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to upload songs.');
      return;
    }

    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please upload an audio file (MP3, WAV, OGG, FLAC, AAC).');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setIsUploading(true);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp3';
      const safePath = `public/${crypto.randomUUID()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('songs')
        .upload(safePath, file);

      if (uploadError) throw new Error(uploadError.message);

      const { error } = await insertSongAction(songTitle, artist, uploadData.path);
      if (error) throw new Error(error);

      toast.success('Song uploaded successfully!');
      setSongTitle('');
      setArtist('');
      setFile(null);
      onSuccess?.();
      onChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload song');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onChange={onChange}
      title="Upload a Song"
      description="Add a new song to your library"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Song Title</label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="Enter song title"
            className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Enter artist name"
            className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Song File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 rounded-md bg-neutral-700 text-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 file:bg-neutral-600 file:text-white file:border-0 file:mr-3 file:cursor-pointer hover:file:bg-neutral-500"
          />
          {file && <p className="text-sm text-neutral-400 mt-1">Selected: {file.name}</p>}
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className="w-full px-3 py-3 rounded-full bg-green-500 text-black font-semibold hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isUploading ? 'Uploading...' : 'Upload Song'}
        </button>
      </form>
    </Modal>
  );
};

export default SongUpload;