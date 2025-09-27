// src/components/auth/GoogleLoginButton.tsx

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export const GoogleLoginButton = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // The redirect is handled by the AuthContext, so we don't need to do anything here.
      // The loading state will persist until the page reloads.
    } catch (error) {
      // The context handles showing errors. We just need to reset the button's loading state.
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className="w-full h-11 text-base" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FcGoogle className="mr-2 h-5 w-5" />
      )}
      {isLoading ? 'Redirecting...' : 'Continue with Google'}
    </Button>
  );
};
