// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, signOut, User, getRedirectResult } from 'firebase/auth'; // Import signInWithRedirect and getRedirectResult
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

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

  useEffect(() => {
    // This is the main listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // --- THIS IS THE FIX ---
    // This effect runs once on app load to handle the redirect from Google
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has successfully signed in via redirect.
          setUser(result.user);
          toast({ title: 'Success!', description: 'You have been signed in.' });
          // Redirect to homepage after successful login
          window.history.replaceState(null, '', '/');
        }
      } catch (error: any) {
        console.error("Error handling redirect result", error);
        toast({ title: 'Sign In Failed', description: error.message, variant: 'destructive' });
      }
    };
    handleRedirect();
    
    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    // We now use signInWithRedirect instead of signInWithPopup
    await signInWithRedirect(auth, provider);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
    } catch (error: any) {
      console.error("Error signing out", error);
      toast({ title: 'Sign Out Failed', description: error.message, variant: 'destructive' });
    }
  };

  const value = { user, loading, signInWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
