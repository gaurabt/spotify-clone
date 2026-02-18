'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useUser } from '@/hooks/useUser';
import useAuthModal from '@/hooks/useAuthModal';
import Button from '@/components/Button';
import { createBrowserClient } from '@supabase/ssr';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const router = useRouter();
  const { user, userDetails, isLoading } = useUser();
  const authModal = useAuthModal();

  const supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <Header>
          <div className="mb-2">
            <h1 className="text-white text-3xl font-semibold">
              Account
            </h1>
          </div>
        </Header>

        <div className="mt-2 mb-7 px-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-neutral-400 mb-6">
              You need to log in to view your account
            </p>
            <Button
              onClick={authModal.onOpen}
              className="bg-emerald-500 text-black px-6 py-3"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
            Account
          </h1>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        <div className="max-w-2xl">
          {/* Profile Section */}
          <div className="bg-neutral-800 rounded-lg p-6 mb-6">
            <h2 className="text-white text-2xl font-semibold mb-4">
              Profile
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-neutral-400 text-sm mb-1">Email</p>
                <p className="text-white">{user.email}</p>
              </div>

              {userDetails?.full_name && (
                <div>
                  <p className="text-neutral-400 text-sm mb-1">Full Name</p>
                  <p className="text-white">{userDetails.full_name}</p>
                </div>
              )}

              <div>
                <p className="text-neutral-400 text-sm mb-1">User ID</p>
                <p className="text-white text-xs font-mono">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-neutral-800 rounded-lg p-6 mb-6">
            <h2 className="text-white text-2xl font-semibold mb-4">
              Settings
            </h2>
            <div className="space-y-3">
              <Button 
                onClick={() => {}}
                className="w-full bg-neutral-700 text-white hover:bg-neutral-600"
              >
                Change Password
              </Button>
              <Button 
                onClick={() => {}}
                className="w-full bg-neutral-700 text-white hover:bg-neutral-600"
              >
                Manage Subscriptions
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-neutral-800 border border-red-900/50 rounded-lg p-6">
            <h2 className="text-red-400 text-2xl font-semibold mb-4">
              Danger Zone
            </h2>
            <Button 
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
