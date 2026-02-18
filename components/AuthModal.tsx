'use client'

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { createBrowserClient } from "@supabase/ssr";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import useAuthModal from "@/hooks/useAuthModal";

const AuthModal = () => {
  const router = useRouter();
  const [supabaseClient] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  const { isOpen, onClose } = useAuthModal();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
      router.refresh();
    }
  }

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        router.refresh();
        onClose();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabaseClient, onClose, router]);

  return (  
    <Modal
      title="Welcome back"
      description="Sign in to continue"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth 
        theme="dark"
        magicLink
        providers={["github", "google"]}
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#22c55e'
              }
            }
          }
        }}
      />
    </Modal>
  );
}
 
export default AuthModal;