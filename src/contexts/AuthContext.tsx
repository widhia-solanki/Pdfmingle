// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        if (router.pathname === '/login' || router.pathname === '/signup') {
          router.push('/');
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');

    // --- THIS IS THE FIX ---
    // This tells Google to always show the account selection screen.
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Success!', description: 'You have been signed in.' });
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      toast({ title: 'Sign In Failed', description: error.message, variant: 'destructive' });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Signed Out' });
      router.push('/login');
    } catch (error: any) {
      console.error("Error signing out", error);
      toast({ title: 'Sign Out Failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
