import { useState, useEffect } from 'react';
import { userSession } from '@/lib/stacks-auth';
import { getUserByWallet, type User } from '@/lib/supabase-api';

/**
 * Custom hook to get current user from Supabase
 * 
 * Why: Centralized user state management
 * Used in: Components that need current user data
 * 
 * Location: Any component that needs user info
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (userSession.isUserSignedIn()) {
          const data = userSession.loadUserData();
          const address = data.profile.stxAddress.testnet || data.profile.stxAddress.mainnet;
          setWalletAddress(address);

          if (address) {
            const userData = await getUserByWallet(address);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading, walletAddress };
}

