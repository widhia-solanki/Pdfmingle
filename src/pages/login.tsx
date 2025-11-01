// src/pages/login.tsx

import { useState, useEffect, useRef, FormEvent } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';

// UI Components from shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox"

// Hooks and Icons
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Firebase Authentication
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { PDFMingleIcon } from '@/components/PDFMingleIcon';

// A simple Google Icon component for the button
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="mr-2">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);


const LoginPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  // State from original file
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for new UI features
  const [showPassword, setShowPassword] = useState(false);

  // --- Start of new animation logic ---
  const purpleCharRef = useRef<HTMLDivElement>(null);
  const blackCharRef = useRef<HTMLDivElement>(null);
  const orangeCharRef = useRef<HTMLDivElement>(null);
  const yellowCharRef = useRef<HTMLDivElement>(null);

  const purpleMouthRef = useRef<HTMLDivElement>(null);
  const blackMouthRef = useRef<HTMLDivElement>(null);
  const orangeMouthRef = useRef<HTMLDivElement>(null);
  const yellowMouthRef = useRef<HTMLDivElement>(null);

  const cursorRef = useRef<HTMLDivElement>(null);

  // This function sets the initial state of the characters
  const initCharacters = () => {
      const refs = [purpleCharRef, blackCharRef, orangeCharRef, yellowCharRef];
      refs.forEach(ref => {
        if(ref.current) ref.current.style.transform = 'translateY(0)';
      });

      if (purpleMouthRef.current) purpleMouthRef.current.className = 'mouth sad';
      if (blackMouthRef.current) blackMouthRef.current.className = 'mouth neutral';
      if (orangeMouthRef.current) orangeMouthRef.current.className = 'mouth smile';
      if (yellowMouthRef.current) yellowMouthRef.current.className = 'mouth neutral';
  };

  // This function handles the character animations based on different user interactions.
  const animateCharacters = (action: 'mouseEnter' | 'mouseLeave' | 'click' | 'typing') => {
      switch(action) {
          case 'mouseEnter':
              if (purpleCharRef.current) purpleCharRef.current.style.transform = 'translateY(-10px)';
              if (blackCharRef.current) blackCharRef.current.style.transform = 'translateY(-5px)';
              if (orangeCharRef.current) orangeCharRef.current.style.transform = 'translateY(5px)';
              if (yellowCharRef.current) yellowCharRef.current.style.transform = 'translateY(-5px)';
              break;
          case 'mouseLeave': initCharacters(); break;
          case 'click':
              if (purpleCharRef.current) purpleCharRef.current.style.transform = 'translateY(-20px) rotate(-5deg)';
              if (blackCharRef.current) blackCharRef.current.style.transform = 'translateY(-15px) rotate(5deg)';
              break;
          case 'typing':
              if (purpleCharRef.current) purpleCharRef.current.style.transform = 'translateY(5px) rotate(3deg)';
              if (blackCharRef.current) blackCharRef.current.style.transform = 'translateY(3px) rotate(-3deg)';
              break;
      }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    initCharacters();
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Event handlers for interactive elements
  const interactiveProps = {
    onMouseEnter: () => animateCharacters('mouseEnter'),
    onMouseLeave: () => animateCharacters('mouseLeave'),
    onMouseDown: () => animateCharacters('click'),
    onFocus: () => animateCharacters('typing'),
    onBlur: () => animateCharacters('mouseLeave')
  };
  // --- End of new animation logic ---

  // PRESERVED: Original form submission logic with Firebase
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    animateCharacters('click'); // Trigger animation on submit

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success!', description: 'You have been logged in.' });
      router.push('/');
    } catch (err: any) {
      const message = err.message.replace('Firebase: ', ''); // Clean up error message
      setError(message);
      toast({ title: 'Login Failed', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setTimeout(initCharacters, 300); // Reset characters after action
    }
  };

  // ADDED: Google Sign-In handler
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Success!', description: 'You have been logged in with Google.' });
      router.push('/');
    } catch (err: any) {
      const message = err.message.replace('Firebase: ', '');
      setError(message);
      toast({ title: 'Login Failed', description: message, variant: 'destructive' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Login" noindex={true} />
      <style jsx global>{`
        /* Custom non-Tailwind styles for animations and cursor */
        .character { position: absolute; transition: all 0.3s ease; }
        .eye { width: 10px; height: 10px; background-color: white; border-radius: 50%; position: absolute; }
        .mouth { width: 30px; height: 5px; background-color: #333; border-radius: 5px; position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); transition: all 0.3s ease; }
        .mouth.smile { border-radius: 0 0 20px 20px; }
        .mouth.sad { border-radius: 20px 20px 0 0; transform: translateX(-50%) translateY(10px); }
        .mouth.neutral { transform: translateX(-50%); }

        .cursor { position: fixed; width: 20px; height: 20px; border: 2px solid #6a4c93; border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); transition: transform 0.1s ease-out; display: none; }
        .cursor::after { content: ''; position: absolute; top: 50%; left: 50%; width: 8px; height: 8px; background-color: #6a4c93; border-radius: 50%; transform: translate(-50%, -50%); }
        @media (min-width: 1024px) { .cursor { display: block; } }
      `}</style>

      <div className="flex h-screen w-full bg-background flex-col lg:flex-row">
        {/* Left Panel: Animated Characters */}
        <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center bg-secondary relative overflow-hidden">
            <div className="relative w-[300px] h-[300px]">
                <div ref={purpleCharRef} className="character" style={{ top: '50px', left: '70px' }}>
                    <div className="w-[100px] h-[120px] bg-[#6a4c93] rounded-t-2xl flex justify-center items-center relative"><div className="eye" style={{ left: '25px' }}></div><div className="eye" style={{ right: '25px' }}></div><div ref={purpleMouthRef} className="mouth sad"></div></div>
                </div>
                <div ref={blackCharRef} className="character" style={{ top: '80px', left: '120px' }}>
                    <div className="w-[80px] h-[100px] bg-[#222] rounded-t-2xl flex justify-center items-center relative"><div className="eye" style={{ left: '20px' }}></div><div className="eye" style={{ right: '20px' }}></div><div ref={blackMouthRef} className="mouth neutral"></div></div>
                </div>
                <div ref={orangeCharRef} className="character" style={{ bottom: '40px', left: '50px' }}>
                    <div className="w-[150px] h-[80px] bg-[#ff7b25] rounded-b-[50px] flex justify-center items-center relative"><div className="eye" style={{ left: '35px' }}></div><div className="eye" style={{ right: '35px' }}></div><div ref={orangeMouthRef} className="mouth smile"></div></div>
                </div>
                <div ref={yellowCharRef} className="character" style={{ top: '100px', left: '160px' }}>
                    <div className="w-[70px] h-[90px] bg-[#ffd166] rounded-t-2xl flex justify-center items-center relative"><div className="eye" style={{ left: '15px' }}></div><div className="eye" style={{ right: '15px' }}></div><div ref={yellowMouthRef} className="mouth neutral"></div></div>
                </div>
            </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center bg-card p-4">
            <div className="w-full max-w-sm p-8 space-y-6">
                <div className="flex justify-center"><PDFMingleIcon /></div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
                    <p className="text-muted-foreground">Please enter your details to sign in.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading || isGoogleLoading} {...interactiveProps} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} id="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading || isGoogleLoading} {...interactiveProps} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground" {...interactiveProps}>
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" {...interactiveProps} disabled={isLoading || isGoogleLoading} />
                            <Label htmlFor="remember" className="text-muted-foreground font-normal">Remember me</Label>
                        </div>
                        <Link href="/forgot-password" passHref><a className="font-medium text-primary hover:underline" {...interactiveProps}>Forgot password?</a></Link>
                    </div>

                    {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
                    
                    <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800 h-11" disabled={isLoading || isGoogleLoading} {...interactiveProps}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Logging in...' : 'Log in'}
                    </Button>
                    
                    <Button type="button" variant="outline" className="w-full h-11" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading} {...interactiveProps}>
                        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                        Log in with Google
                    </Button>
                </form>
                
                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" passHref><a className="font-medium text-primary hover:underline" {...interactiveProps}>Sign up</a></Link>
                </div>
            </div>
        </div>
        <div ref={cursorRef} className="cursor"></div>
      </div>
    </>
  );
};

export default LoginPage;
