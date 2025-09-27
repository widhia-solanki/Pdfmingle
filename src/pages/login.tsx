// src/pages/login.tsx

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LoginPage: NextPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If the user is already logged in, redirect them to the homepage.
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  // While Firebase is checking the auth state, show a loading message.
  if (loading || user) {
      return (
          <div className="w-full min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center p-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h1 className="text-2xl font-semibold text-foreground">Loading Session...</h1>
              <p className="text-muted-foreground">Please wait while we check your credentials.</p>
          </div>
      );
  }

  return (
    <>
      <NextSeo title="Login" noindex={true} />
      <div className="w-full min-h-[calc(100vh-10rem)] flex items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-sm p-8 space-y-6 bg-card border border-border rounded-lg shadow-md text-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome!</h1>
            <p className="text-muted-foreground mt-2">Sign in or create an account to continue.</p>
          </div>
          
          <GoogleLoginButton />

          <p className="text-center text-xs text-muted-foreground pt-4">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
