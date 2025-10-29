// src/pages/forgot-password.tsx

import { useState, FormEvent } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordPage: NextPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Reset Password" noindex={true} />
      <div className="w-full min-h-[calc(100vh-10rem)] flex items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-md">
          {isSubmitted ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">Check your inbox</h1>
              <p className="text-muted-foreground mt-2">A password reset link has been sent to <span className="font-semibold text-primary">{email}</span>.</p>
              <Button asChild className="mt-6"><Link href="/login">Back to Login</Link></Button>
            </div>
          ) : (
            <>
              <div className="text-center"><h1 className="text-3xl font-bold text-foreground">Forgot Password?</h1><p className="text-muted-foreground mt-2">Enter your email and we'll send you a link to reset your password.</p></div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} /></div>
                {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
                <Button type="submit" className="w-full h-11" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}{isLoading ? 'Sending...' : 'Send Reset Link'}</Button>
              </form>
              <p className="text-center text-sm text-muted-foreground"><Link href="/login" className="font-semibold text-primary hover:underline">Back to Login</Link></p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
