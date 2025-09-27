// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// --- THIS IS THE FIX ---
// The `login` function, which is used on the email/password form, has been added to the type.
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void; // Added this line
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // This function is for the standard email/password flow
  const login = (userData: User) => {
    setUser(userData);
    // Note: This only sets the state. The actual login API call happens in LoginPage.
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Manually set user after successful sign-in
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

  const value = { user, loading, login, signInWithGoogle, logout };

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
