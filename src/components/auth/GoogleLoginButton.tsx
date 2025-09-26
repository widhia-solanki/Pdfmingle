// src/components/auth/GoogleLoginButton.tsx

import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

// --- THIS IS THE FIX ---
// We define the Google Icon as a simple React component.
// This removes the need for the 'react-icons' library.
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M43.611 20.083H24v8.528h11.303c-1.649 4.657-6.08 8.12-11.303 8.12-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FBBC05" d="M6.306 14.691L24 31.962l11.389-11.388c-5.22-4.643-12.871-4.475-18.083 3.117z" />
    <path fill="#34A853" d="M24 44c5.166 0 9.86-1.977 13.409-5.192L27.977 31.427C25.962 32.887 25.035 33.15 24 33.15c-3.214 0-5.441-2.091-6.19-4.886L6.289 31.493C9.07 39.429 15.93 44 24 44z" />
    <path fill="#EA4335" d="M43.611 20.083H24v8.528h11.303c-.792 2.237-2.231 4.16-4.082 5.571l7.747 7.747C43.518 36.376 44 33 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);


export const GoogleLoginButton = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
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

        login(data.user);
        toast({ title: 'Success!', description: 'You have been logged in with Google.' });
        window.location.href = '/';

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
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/drive.file'
  });

  return (
    <Button variant="outline" className="w-full h-11" onClick={() => handleGoogleLogin()} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      {isLoading ? 'Redirecting...' : 'Continue with Google'}
    </Button>
  );
};

export default GoogleLoginButton;
