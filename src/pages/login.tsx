// src/pages/login.tsx

import { useState, FormEvent } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'; // Import the new button
import { Separator } from '@/components/ui/separator';

const LoginPage: NextPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please try again.');
      }
      login(data.user);
      toast({ title: 'Success!', description: 'You have been logged in.' });
      window.location.href = '/';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
      toast({ title: 'Login Failed', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Login" noindex={true} />
      <div className="w-full min-h-[calc(100vh-10rem)] flex items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
            <p className="text-muted-foreground mt-2">Sign in to your PDFMingle account.</p>
          </div>

          <div className="space-y-4">
            <GoogleLoginButton />
            {/* The separator is optional if you remove email/password login */}
            <div className="relative flex items-center">
              <Separator className="flex-grow" />
              <span className="mx-2 flex-shrink-0 text-xs uppercase text-muted-foreground">Or</span>
              <Separator className="flex-grow" />
            </div>
          </div>
          
          {/* This is the old email/password form. You can remove this entire <form> tag. */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... email and password inputs ... */}
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {/* ... */}
              Sign In with Email
            </Button>
          </form>
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
export default LoginPage;
