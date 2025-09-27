// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, signOut, User, getRedirectResult } from 'firebase/auth'; // Import signInWithRedirect and getRedirectResult
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // This is the main listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // --- THIS IS THE FIX ---
    // This effect runs on app load to handle the redirect back from Google
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has successfully signed in via redirect.
          toast({ title: 'Success!', description: 'You have been signed in.' });
          router.push('/');
        }
      } catch (error: any) {
        console.error("Error handling redirect result", error);
        toast({ title: 'Sign In Failed', description: 'Could not complete sign-in. Please try again.', variant: 'destructive' });
      }
    };
    handleRedirect();
    
    return () => unsubscribe();
  }, [router, toast]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.setCustomParameters({ prompt: 'select_account' });
    
    // We now use signInWithRedirect
    await signInWithRedirect(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    toast({ title: 'Signed Out' });
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </Auth-Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
