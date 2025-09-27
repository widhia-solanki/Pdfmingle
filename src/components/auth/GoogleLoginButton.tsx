// src/components/auth/GoogleLoginButton.tsx

import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export const GoogleLoginButton = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    // This is the correct flow for your backend. It provides a one-time code.
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: codeResponse.code }), 
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Google login failed.');
        }

        toast({ title: 'Success!', description: 'You have been logged in with Google.' });
        window.location.href = '/'; // Redirect to homepage
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        toast({ title: 'Login Failed', description: message, variant: 'destructive' });
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({ title: 'Login Failed', description: 'Google authentication failed. Please try again.', variant: 'destructive' });
      setIsLoading(false);
    },
  });

  return (
    <Button variant="outline" className="w-full h-11" onClick={() => login()} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FcGoogle className="mr-2 h-5 w-5" />
      )}
      {isLoading ? 'Redirecting...' : 'Continue with Google'}
    </Button>
  );
};
