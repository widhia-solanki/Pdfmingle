// src/components/auth/AuthGuard.tsx

import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const isSignedIn = !!session?.user;

  useEffect(() => {
    // Only perform the redirect check AFTER the loading is complete.
    if (!isLoading && !isSignedIn) {
      // If not signed in, redirect to the login page.
      router.push('/login');
    }
  }, [isLoading, isSignedIn, router]);

  // --- THIS IS THE FIX ---
  // While the session is loading OR if the user is not signed in yet
  // (and the redirect is about to happen), show a full-page loading screen.
  if (isLoading || !isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  // If loading is complete AND the user is signed in, render the protected content.
  return <>{children}</>;
};
