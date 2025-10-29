// src/pages/login.tsx

import { useState, FormEvent } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage: NextPage = () => {
  const router = useRouter();
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
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success!', description: 'You have been logged in.' });
      router.push('/');
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Login" noindex={true} />
      <div className="w-full min-h-[calc(100vh-10rem)] flex items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-md">
          <div className="text-center"><h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1><p className="text-muted-foreground mt-2">Sign in to your PDFMingle account.</p></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} /></div>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><Label htmlFor="password">Password</Label><Link href="/forgot-password" passHref><span className="text-sm text-primary hover:underline cursor-pointer">Forgot password?</span></Link></div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>
            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full h-11" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}{isLoading ? 'Signing In...' : 'Sign In'}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">Don't have an account?{' '}<Link href="/signup" className="font-semibold text-primary hover:underline">Sign up</Link></p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
