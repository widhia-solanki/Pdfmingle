// src/pages/login.tsx

import { useState, useEffect, useRef, FormEvent } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";

// Hooks and Icons
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Firebase Authentication
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// --- Helper Components ---

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V20M4 12H20" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {isVisible && <path d="M2 2L22 22" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,36.638,44,30.65,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // --- Animation State ---
  const [animationState, setAnimationState] = useState('idle');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleAnimationEnd = () => {
      if (animationState === 'peek') {
        setAnimationState(email ? 'typing-email' : password ? 'typing-password' : 'idle');
      }
    };

    container.addEventListener('animationend', handleAnimationEnd);
    container.dataset.state = animationState;

    return () => container.removeEventListener('animationend', handleAnimationEnd);
  }, [animationState, email, password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnimationState('submitting');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success!', description: 'You have been logged in.' });
      router.push('/');
    } catch (err: any) {
      const message = err.message.replace('Firebase: ', '');
      setError(message);
      toast({ title: 'Login Failed', description: message, variant: 'destructive' });
      setAnimationState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Success!', description: 'You have been logged in with Google.' });
      router.push('/');
    } catch (err: any) {
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Login" noindex={true} />
      <style jsx global>{`
        /* --- Character Animation CSS --- */
        .characters {
          --char-transition: transform 0.3s ease-in-out;
        }
        .character { position: absolute; transition: var(--char-transition); }
        .face { position: absolute; width: 100%; height: 100%; }
        .eye { position: absolute; background-color: #111; border-radius: 50%; transition: all 0.2s ease; }
        .mouth { position: absolute; background-color: #111; transition: all 0.2s ease; }

        /* -- Character Definitions -- */
        .char-purple { top: 30%; left: 35%; width: 60px; height: 70px; }
        .char-purple .shape { width: 100%; height: 100%; background-color: #6c47ff; clip-path: polygon(15% 0, 100% 20%, 85% 100%, 0 80%); }
        .char-purple .eye { width: 6px; height: 8px; }
        .char-purple .eye-left { top: 25px; left: 15px; }
        .char-purple .eye-right { top: 25px; right: 15px; }
        .char-purple .mouth { top: 45px; left: 50%; transform: translateX(-50%); width: 15px; height: 2px; border-radius: 2px; }

        .char-black { top: 40%; left: 40%; width: 45px; height: 55px; z-index: 10; }
        .char-black .shape { width: 100%; height: 100%; background-color: #111; border-radius: 8px 8px 6px 6px; }
        .char-black .eye { background-color: #fff; width: 6px; height: 6px; }
        .char-black .eye-left { top: 20px; left: 12px; }
        .char-black .eye-right { top: 20px; right: 12px; }
        
        .char-yellow { top: 50%; left: 45%; width: 40px; height: 50px; }
        .char-yellow .shape { width: 100%; height: 100%; background-color: #ffc700; border-radius: 20px 20px 12px 12px; }
        .char-yellow .eye { width: 5px; height: 5px; top: 20px; }
        .char-yellow .eye-left { left: 10px; }
        .char-yellow .eye-right { right: 10px; }
        .char-yellow .mouth { top: 35px; left: 50%; transform: translateX(-50%); width: 2px; height: 6px; border-radius: 2px; }

        .char-orange { top: 60%; left: 30%; width: 80px; height: 40px; }
        .char-orange .shape { width: 100%; height: 100%; background-color: #ff6b2e; border-radius: 40px 40px 0 0; }
        .char-orange .mouth { top: 15px; left: 50%; transform: translateX(-50%); width: 15px; height: 15px; background: transparent; border: 2px solid #111; border-radius: 50%; border-top-color: transparent; border-left-color: transparent; border-right-color: transparent; }

        /* --- Idle Animation --- */
        @keyframes idle-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        [data-state='idle'] .character {
          animation: idle-bob 2s ease-in-out infinite;
        }

        /* --- Animation States --- */
        [data-state='idle'] .char-orange .mouth { transform: translateX(-50%) rotate(180deg); top: 20px; }
        [data-state='idle'] .char-purple { transform: translateY(3px); }

        /* Typing Email */
        [data-state='typing-email'] .character { transform-origin: bottom center; }
        [data-state='typing-email'] .char-purple { transform: rotate(-5deg) translateX(-10px) translateY(3px); }
        [data-state='typing-email'] .char-black { transform: rotate(-3deg) translateX(-8px); }
        [data-state='typing-email'] .char-yellow { transform: rotate(-2deg) translateX(-5px); }
        [data-state='typing-email'] .eye { transform: translateX(-2px); }

        /* Typing Password */
        [data-state='typing-password'] .char-purple .eye-left, [data-state='typing-password'] .char-purple .eye-right,
        [data-state='typing-password'] .char-black .eye-left, [data-state='typing-password'] .char-black .eye-right { transform: scaleY(0.2) translateY(1px); }
        [data-state='typing-password'] .char-yellow .mouth { height: 2px; top: 38px; }
        [data-state='typing-password'] .char-orange .mouth { height: 2px; border-radius: 2px; border: none; background: #111; top: 18px; }
        
        /* Peek */
        @keyframes peek-animation {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        [data-state='peek'] .character { animation: peek-animation 0.3s ease; }
        [data-state='peek'] .char-purple .eye, [data-state='peek'] .char-black .eye { width: 8px; height: 8px; }
        [data-state='peek'] .char-yellow .mouth { width: 10px; height: 10px; top: 32px; border-radius: 50%; background: #111; border: none; }
        [data-state='peek'] .char-orange .mouth { width: 18px; height: 18px; top: 15px; }

        /* Submitting */
        [data-state='submitting'] .eye { transform: scaleY(0.1); }
        [data-state='submitting'] .mouth { transform: translateX(-50%) scale(0.8); }

        /* Error */
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
        [data-state='error'] .character { animation: shake 0.2s ease; }
        [data-state='error'] .char-purple .mouth, [data-state='error'] .char-yellow .mouth { transform: translateX(-50%) rotate(180deg); }
        [data-state='error'] .char-orange .mouth { transform: translateX(-50%) rotate(180deg); top: 20px; }
      `}</style>

      <div className="flex h-screen w-full bg-[#fafafa] font-sans">
        {/* Left Panel - Characters */}
        <div ref={containerRef} className="hidden lg:flex w-1/2 justify-center items-center relative">
          <div className="characters relative w-[300px] h-[300px]">
            <div className="character char-orange"><div className="shape"><div className="face"><div className="mouth"></div></div></div></div>
            <div className="character char-black"><div className="shape"><div className="face"><div className="eye eye-left"></div><div className="eye eye-right"></div></div></div></div>
            <div className="character char-purple"><div className="shape"><div className="face"><div className="eye eye-left"></div><div className="eye eye-right"></div><div className="mouth"></div></div></div></div>
            <div className="character char-yellow"><div className="shape"><div className="face"><div className="eye eye-left"></div><div className="eye eye-right"></div><div className="mouth"></div></div></div></div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center bg-white rounded-l-[2rem]">
          <div className="w-full max-w-sm p-8 space-y-6">
            <div className="flex justify-center"><PlusIcon /></div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-500 mt-1 text-sm">Please enter your details</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={email}
                  onFocus={() => setAnimationState('typing-email')}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer h-10 pt-3 border-0 border-b-2 border-gray-200 focus:border-gray-900 placeholder-transparent focus:outline-none focus:ring-0" 
                  placeholder="Email"
                />
                <label htmlFor="email" className="absolute left-0 -top-2.5 text-gray-500 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-gray-500 peer-focus:text-xs">Email</label>
              </div>
              
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  required 
                  value={password}
                  onFocus={() => setAnimationState('typing-password')}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer h-10 pt-3 border-0 border-b-2 border-gray-200 focus:border-gray-900 placeholder-transparent focus:outline-none focus:ring-0" 
                  placeholder="Password"
                />
                <label htmlFor="password" className="absolute left-0 -top-2.5 text-gray-500 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-gray-500 peer-focus:text-xs">Password</label>
                <button type="button" onClick={() => { setShowPassword(!showPassword); setAnimationState('peek'); }} className="absolute right-0 top-2">
                  <EyeIcon isVisible={!showPassword} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Checkbox id="remember" className="rounded"/>
                  <label htmlFor="remember" className="text-gray-600 font-medium cursor-pointer">Remember for 30 days</label>
                </div>
                <Link href="/forgot-password" passHref><a className="font-medium text-gray-600 hover:text-gray-900">Forgot password?</a></Link>
              </div>
              
              {error && <p className="text-xs font-medium text-red-500 text-center">{error}</p>}

              <div className="space-y-3">
                <Button type="submit" className="w-full h-10 bg-gray-900 text-white hover:bg-gray-800 rounded-full text-sm font-semibold" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Log in
                </Button>
                <Button type="button" variant="outline" className="w-full h-10 rounded-full text-sm font-semibold border-gray-300 hover:bg-gray-50" onClick={handleGoogleLogin} disabled={isGoogleLoading}>
                  {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                  Log in with Google
                </Button>
              </div>
            </form>
            
            <p className="text-center text-xs text-gray-500">
              Don't have an account?{' '}
              <Link href="/signup" passHref><a className="font-semibold text-gray-900 hover:underline">Sign up</a></Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
