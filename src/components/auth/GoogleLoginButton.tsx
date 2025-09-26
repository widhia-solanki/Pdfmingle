// src/components/auth/GoogleLoginButton.tsx

import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc'; // You'll need to add react-icons: npm install react-icons
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export const GoogleLoginButton = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        // Send the authorization code to your backend
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
    // This is the correct "offline" flow that provides an authorization code
    flow: 'auth-code',
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

export default GoogleLoginButton;
