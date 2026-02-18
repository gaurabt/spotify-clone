import { User } from '@supabase/supabase-js';
import { createContext, useEffect, useState, useCallback } from 'react';

import { UserDetails, Subscription } from '@/types';
import { useContext } from 'react';
import { createBrowserClient } from '@supabase/ssr';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
};

export const MyUserContextProvider = (props: Props) => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const accessToken = user?.user_metadata?.access_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    setIsLoadingUser(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoadingUser(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () => 
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()])
        .then((results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          if (userDetailsPromise.status === 'fulfilled') {
            setUserDetails(userDetailsPromise.value.data as UserDetails);
          }
          if (subscriptionPromise.status === 'fulfilled') {
            setSubscription(subscriptionPromise.value.data as Subscription);
          }
          setIsLoadingData(false);
        }
      )
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription,
  };

  return <UserContext.Provider value={value} {...props} />;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a MyUserContextProvider');
  } 
  return context;
}
