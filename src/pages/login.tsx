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
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
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
      // This is a placeholder for your email/password API call.
      // Since we are focusing on Google Login, this part is commented out,
      // but the structure is here for when you implement it.
      
      // const response = await fetch(`/api/login`, { ... });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.error);
      // login(data.user); // Update context
      
      // For now, we'll just show an error that this isn't implemented
      toast({ title: 'Not Implemented', description: 'Please use "Continue with Google" to sign in.', variant: 'destructive' });
      setIsLoading(false); // Make sure to stop loading
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
      toast({ title: 'Login Failed', description: message, variant: 'destructive' });
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
            <div className="relative flex items-center">
              <Separator className="flex-grow" />
              <span className="mx-2 flex-shrink-0 text-xs uppercase text-muted-foreground">Or</span>
              <Separator className="flex-grow" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>
            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              {isLoading ? 'Signing In...' : 'Sign In with Email'}
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

// --- THIS IS THE FIX ---
// The duplicate export line has been removed.
export default LoginPage;
