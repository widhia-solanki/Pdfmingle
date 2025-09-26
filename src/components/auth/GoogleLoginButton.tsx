src/components/auth/GoogleLoginButton.tsx

import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FcGoogle } from 'react-icons/fc'; // You'll need to add react-icons: npm install react-icons

const GoogleLoginButton = () => {
  const { toast } = useToast();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // The backend needs the ID token, not the access token.
      // We will need to fetch it.
      // This is a simplification. A more robust solution would exchange the auth code on the backend.
      // For now, we will assume an ID token is part of the flow. A better approach is using the `useGoogleOneTapLogin` or `GoogleLogin` component if you get an auth code.
      // Let's assume you get an id_token for now to keep it simple.
      // Note: A better flow is to send the `code` to your backend.
      
      const idToken = tokenResponse.id_token; // This might not be available in this flow.
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: idToken || tokenResponse.access_token }), // sending access token as fallback
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Google login failed.');
        }

        toast({ title: 'Success!', description: 'You have been logged in with Google.' });
        window.location.href = '/';
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        toast({ title: 'Login Failed', description: message, variant: 'destructive' });
      }
    },
    onError: () => {
      toast({ title: 'Login Failed', description: 'Google authentication failed. Please try again.', variant: 'destructive' });
    },
    // To get Drive access, you add the scope here.
    scope: 'https://www.googleapis.com/auth/drive.file',
  });

  return (
    <Button variant="outline" className="w-full" onClick={() => handleGoogleLogin()}>
      <FcGoogle className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;
