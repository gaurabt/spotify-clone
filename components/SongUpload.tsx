import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';

const SongUpload = () => {
  const supabase = useSupabaseClient();
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!songTitle || !artist || !file) {
      toast.error('Please fill in all fields and select a file.');
      return;
    }

    setIsUploading(true);

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('songs')
        .upload(`public/${file.name}`, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: insertData, error: insertError } = await supabase
        .from('songs')
        .insert({
          title: songTitle,
          artist,
          file_path: uploadData.path,
        });

      if (insertError) {
        throw insertError;
      }

      toast.success('Song uploaded successfully!');
      setSongTitle('');
      setArtist('');
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload song.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-xl font-semibold text-white mb-4">Upload a Song</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Song Title</label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Song File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full text-gray-300"
          />
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload Song'}
        </button>
      </form>
    </div>
  );
};

export default SongUpload;