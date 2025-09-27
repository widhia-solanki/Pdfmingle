// src/components/auth/AuthGuard.tsx

import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If the session is still being verified, show a loading spinner
if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If verification is done and there is no user, redirect to login
  if (!user) {
    router.push('/login');
    return null; // Render nothing while redirecting
  }

  // If the user is logged in, render the protected page content
  return <>{children}</>;
};
