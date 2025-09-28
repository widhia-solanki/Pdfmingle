// src/components/auth/AuthGuard.tsx

import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  // --- THIS IS THE FIX ---
  // We now use the 'useSession' hook from NextAuth.js.
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const isSignedIn = !!session?.user;

  useEffect(() => {
    // If loading is finished and the user is not signed in, redirect them.
    if (!isLoading && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoading, isSignedIn, router]);

  // While the session is being verified, show a loading spinner.
  if (isLoading || !isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is signed in, render the protected page content.
  return <>{children}</>;
};
