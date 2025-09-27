// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, signOut, User, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  login: (user: User) => void; // Keep for email/password form
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // This listener handles all auth state changes, including logout and initial load
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    // --- THIS IS THE FIX ---
    // This effect runs only once when the app loads to check for a redirect.
    // It prevents conflicts with the main auth listener.
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // This means the user has just signed in via Google redirect.
          toast({ title: 'Success!', description: 'You have been signed in.' });
          // We don't need to setUser here because onAuthStateChanged will handle it.
          // We just need to redirect them away from the login page.
          router.push('/');
        }
      } catch (error: any) {
        // Handle specific errors if needed, e.g., account exists with different credential
        console.error("Error processing redirect result:", error);
        toast({ title: 'Sign In Failed', description: 'Could not complete sign-in. Please try again.', variant: 'destructive' });
      }
    };
    checkRedirect();
    
    return () => unsubscribe();
  }, [router, toast]); // Added dependencies

  const signInWithGoogle = async () => {
    setLoading(true); // Set loading state immediately on click
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    await signInWithRedirect(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    toast({ title: 'Signed Out' });
    router.push('/login'); // Redirect to login page after logout
  };

  // Dummy login function for email/password form
  const login = (userData: User) => {
    setUser(userData);
  };

  const value = { user, loading, signInWithGoogle, logout, login };

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
