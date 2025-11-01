// src/pages/login.tsx

import { useState, useEffect, useRef, FormEvent } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";

// Hooks and Icons
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Firebase Authentication
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// --- NEW: Placeholder for the large geometric logo from the screenshot ---
// This component approximates the new logo. You can replace it with your own SVG component.
const LoginLogo = () => (
  <div className="w-48 h-48 relative">
    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-400" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-600" style={{ clipPath: 'polygon(100% 0, 0 0, 0 100%)' }}></div>
    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-600" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>
    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-emerald-300" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-1/3 h-1/3 bg-white transform rotate-45"></div>
    </div>
  </div>
);


const LoginPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // --- Animation Logic (Refs) ---
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // --- OPTIMIZED: Animation using CSS Classes ---
  // This is more performant than manipulating styles directly with JS
  const handleInteraction = (state: 'focus' | 'hover' | 'reset') => {
    if (leftPanelRef.current) {
      leftPanelRef.current.classList.remove('state-focus', 'state-hover');
      if (state === 'focus') {
        leftPanelRef.current.classList.add('state-focus');
      } else if (state === 'hover') {
        leftPanelRef.current.classList.add('state-hover');
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const interactiveProps = {
    onMouseEnter: () => handleInteraction('hover'),
    onMouseLeave: () => handleInteraction('reset'),
    onFocus: () => handleInteraction('focus'),
    onBlur: () => handleInteraction('reset')
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success!', description: 'You have been logged in.' });
      router.push('/');
    } catch (err: any) {
      const message = err.message.replace('Firebase: ', '');
      setError(message);
      toast({ title: 'Login Failed', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Login" noindex={true} />
      <style jsx global>{`
        /* --- OPTIMIZED Animation Styles --- */
        .character {
          position: absolute;
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .left-panel-container.state-hover .char-purple { transform: translateY(-10px) rotate(-3deg); }
        .left-panel-container.state-hover .char-black { transform: translateY(-5px) rotate(2deg); }
        .left-panel-container.state-hover .char-yellow { transform: translateY(-8px) rotate(3deg); }
        .left-panel-container.state-hover .char-orange { transform: translateY(5px); }

        .left-panel-container.state-focus .char-purple { transform: translateY(5px) scale(0.95); }
        .left-panel-container.state-focus .char-black { transform: translateY(0px) scale(1.05); }
        .left-panel-container.state-focus .char-yellow { transform: translateY(3px) rotate(-2deg) scale(0.98); }
        
        .eye { width: 8px; height: 8px; background-color: white; border-radius: 50%; position: absolute; }
        .mouth { width: 20px; height: 4px; background-color: white; border-radius: 5px; position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); }

        .cursor { 
          position: fixed; top: -10px; left: -10px; width: 20px; height: 20px; 
          border: 2px solid #6a4c93; border-radius: 50%; 
          pointer-events: none; z-index: 9999; 
          transition: transform 0.15s ease-out;
          will-change: transform; /* Performance optimization */
          display: none; 
        }
        @media (min-width: 1024px) { .cursor { display: block; } }
      `}</style>

      <div className="flex h-screen w-full bg-background flex-col lg:flex-row">
        {/* Left Panel: Animated Characters */}
        <div ref={leftPanelRef} className="hidden lg:flex left-panel-container w-full lg:w-1/2 justify-center items-center bg-secondary relative overflow-hidden">
            <div className="relative w-[300px] h-[300px]">
                <div className="character char-purple" style={{ top: '50px', left: '70px' }}>
                    <div className="w-[100px] h-[120px] bg-[#6a4c93] rounded-2xl flex justify-center items-center relative"><div className="eye" style={{ top: '40px', left: '25px' }}></div><div className="eye" style={{ top: '40px', right: '25px' }}></div><div className="mouth"></div></div>
                </div>
                <div className="character char-black" style={{ top: '80px', left: '110px' }}>
                    <div className="w-[80px] h-[100px] bg-[#222] rounded-2xl flex justify-center items-center relative"><div className="eye" style={{ top: '35px', left: '20px' }}></div><div className="eye" style={{ top: '35px', right: '20px' }}></div><div className="mouth"></div></div>
                </div>
                <div className="character char-yellow" style={{ top: '90px', left: '160px' }}>
                    <div className="w-[70px] h-[90px] bg-[#ffd166] rounded-2xl flex justify-center items-center relative"><div className="eye" style={{ top: '30px', left: '15px' }}></div><div className="eye" style={{ top: '30px', right: '15px' }}></div><div className="mouth"></div></div>
                </div>
                <div className="character char-orange" style={{ bottom: '40px', left: '50px' }}>
                    <div className="w-[150px] h-[80px] bg-[#ff7b25] rounded-b-[60px] flex justify-center items-center relative"><div className="eye" style={{ top: '25px', left: '35px' }}></div><div className="eye" style={{ top: '25px', right: '35px' }}></div><div className="mouth" style={{ bottom: '20px' }}></div></div>
                </div>
            </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center bg-card p-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="flex justify-center"><LoginLogo /></div>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
                    <p className="text-muted-foreground mt-2">Please enter your details to sign in.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} {...interactiveProps} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} id="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} {...interactiveProps} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground" {...interactiveProps}>
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" {...interactiveProps} disabled={isLoading} />
                            <Label htmlFor="remember" className="text-muted-foreground font-normal cursor-pointer">Remember me</Label>
                        </div>
                        <Link href="/forgot-password" passHref><a className="font-medium text-primary hover:underline" {...interactiveProps}>Forgot password?</a></Link>
                    </div>

                    {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
                    
                    <Button type="submit" className="w-full h-11 text-md" disabled={isLoading} {...interactiveProps}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </form>
            </div>
        </div>
        <div ref={cursorRef} className="cursor"></div>
      </div>
    </>
  );
};

export default LoginPage;
