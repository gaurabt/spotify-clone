'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import useAuthModal from '@/hooks/useAuthModal';
import { createBrowserClient } from '@supabase/ssr';
import toast from 'react-hot-toast';
import { FaUserAlt } from 'react-icons/fa';
import { RxCaretLeft } from 'react-icons/rx';
import { HiOutlineLogout } from 'react-icons/hi';

export default function AccountPage() {
  const router = useRouter();
  const { user, userDetails, isLoading } = useUser();
  const authModal = useAuthModal();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full bg-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full w-full bg-neutral-900 flex flex-col items-center justify-center gap-4">
        <FaUserAlt size={48} className="text-neutral-500" />
        <p className="text-neutral-400 text-sm">Log in to see your profile</p>
        <button
          onClick={authModal.onOpen}
          className="bg-[#1db954] hover:bg-[#1ed760] text-black font-bold px-8 py-3 rounded-full transition text-sm"
        >
          Log in
        </button>
      </div>
    );
  }

  const displayName = userDetails?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="h-full w-full bg-neutral-900 overflow-y-auto">

      {/* ── HERO BANNER ─────────────────────────────────────────────── */}
      <div className="relative bg-linear-to-b from-emerald-800 via-emerald-900/60 to-neutral-900 px-6 pt-16 pb-8">
        {/* back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 rounded-full bg-black/40 hover:bg-black/60 p-1 transition"
        >
          <RxCaretLeft className="text-white" size={30} />
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 max-w-5xl">
          {/* avatar */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-neutral-600 shadow-2xl flex items-center justify-center shrink-0 overflow-hidden">
            {userDetails?.avatar_url ? (
              <img
                src={userDetails.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-5xl font-bold select-none">{initials}</span>
            )}
          </div>

          {/* name + meta */}
          <div className="text-center sm:text-left">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">
              Profile
            </p>
            <h1 className="text-white font-black text-4xl sm:text-6xl mb-3 leading-none">
              {displayName}
            </h1>
            <p className="text-white/60 text-sm">{user.email}</p>
            <p className="text-white/40 text-xs mt-1">Member since {memberSince}</p>
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────── */}
      <div className="px-6 py-8 max-w-2xl space-y-3">

        {/* Account details */}
        <section>
          <h2 className="text-white text-base font-bold mb-3 uppercase tracking-wider">
            Account details
          </h2>
          <div className="bg-[#282828] rounded-lg divide-y divide-neutral-700">
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-neutral-400 text-sm">Email</span>
              <span className="text-white text-sm">{user.email}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-neutral-400 text-sm">Username</span>
              <span className="text-white text-sm">{displayName}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-neutral-400 text-sm">Member since</span>
              <span className="text-white text-sm">{memberSince}</span>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-4 bg-[#282828] hover:bg-[#3e3e3e] rounded-lg transition group"
          >
            <HiOutlineLogout size={20} className="text-neutral-400 group-hover:text-white transition" />
            <span className="text-neutral-400 group-hover:text-white text-sm font-medium transition">
              Log out
            </span>
          </button>
        </section>

      </div>
    </div>
  );
}
