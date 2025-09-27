// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
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
    // This listener is the core of Firebase Auth. It automatically
    // updates the user state whenever the auth status changes.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // This scope is what asks for permission to access Google Drive.
    // It's the best practice for privacy as it only requests access to files
    // created by this app or opened by the user with this app.
    provider.addScope('https://www.googleapis.com/auth/drive.file');
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
