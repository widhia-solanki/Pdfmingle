// src/components/auth/AuthGuard.tsx

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Use our Firebase Auth Context
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there is no user, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // While the session is loading or if there's no user (and redirect is imminent)
  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
      </div>
    );
  }

  // If loading is complete and the user is signed in, render the protected content
  return <>{children}</>;
};
