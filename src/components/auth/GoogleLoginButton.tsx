// src/components/auth/GoogleLoginButton.tsx

import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export const GoogleLoginButton = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    // This function is called on successful login
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        // We send the secure, one-time authorization code to our backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: codeResponse.code }), 
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Google login failed.');
        }

        login(data.user); // Update the global auth state
        toast({ title: 'Success!', description: 'You have been logged in with Google.' });
        window.location.href = '/'; // Redirect to the homepage

      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        toast({ title: 'Login Failed', description: message, variant: 'destructive' });
        setIsLoading(false);
      }
    },
    // This function is called if the user closes the Google popup
    onError: () => {
      toast({ title: 'Login Failed', description: 'Google authentication was cancelled or failed.', variant: 'destructive' });
      setIsLoading(false);
    },
    // This is the most secure flow, which gives a one-time code to the backend
    flow: 'auth-code',
    // This scope is what asks for permission to access Google Drive
    scope: 'https://www.googleapis.com/auth/drive.file'
  });

  return (
    <Button variant="outline" className="w-full h-11" onClick={() => handleGoogleLogin()} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FcGoogle className="mr-2 h-5 w-5" />
      )}
      {isLoading ? 'Redirecting...' : 'Continue with Google'}
    </Button>
  );
};
