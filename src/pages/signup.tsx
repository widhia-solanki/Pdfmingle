// src/pages/signup.tsx

import { useState, FormEvent } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { Separator } from '@/components/ui/separator'; // --- THIS IS THE FIX ---

// Character Components with Animations
const OrangeSemicircle = ({ state }: { state: 'idle' | 'sad' | 'happy' }) => (
  <motion.div
    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-orange-400 rounded-t-full"
    animate={state}
    initial="idle"
    variants={{
      idle: { y: 0, transition: { yoyo: Infinity, duration: 1.5, ease: "easeInOut" } },
      sad: { y: 200, opacity: 0, transition: { duration: 0.5 } },
      happy: { y: [0, -30, 0], transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } },
    }}
  />
);
const PurpleRectangle = ({ state }: { state: 'idle' | 'sad' | 'happy' }) => (
  <motion.div
    className="absolute bottom-0 left-1/4 w-20 h-64 bg-purple-500 rounded-t-lg"
    animate={state}
    initial="idle"
    variants={{
      idle: { y: 0, transition: { yoyo: Infinity, duration: 2.5, ease: "easeInOut" } },
      sad: { rotate: -15, y: 50, opacity: 0, transition: { duration: 0.5 } },
      happy: { rotate: [0, 5, -5, 0], transition: { repeat: Infinity, duration: 1.5 } },
    }}
  />
);
const BlackRectangle = ({ state }: { state: 'idle' | 'sad' | 'happy' }) => (
    <motion.div
      className="absolute bottom-0 right-1/4 w-24 h-48 bg-gray-800 dark:bg-gray-700 rounded-t-md"
      animate={state}
      initial="idle"
      variants={{
        idle: { y: 0, scaleY: 1, transition: { yoyo: Infinity, duration: 3, ease: "easeInOut" } },
        sad: { y: 150, opacity: 0, transition: { duration: 0.5 } },
        happy: { scaleY: [1, 0.9, 1], transition: { repeat: Infinity, duration: 1 } },
      }}
    />
);
const YellowRectangle = ({ state }: { state: 'idle' | 'sad' | 'happy' }) => (
    <motion.div
      className="absolute bottom-0 right-1/2 w-16 h-32 bg-yellow-400 rounded-lg"
      animate={state}
      initial="idle"
      variants={{
        idle: { y: 0, transition: { yoyo: Infinity, duration: 2, ease: "easeInOut" } },
        sad: { x: 100, opacity: 0, transition: { duration: 0.5 } },
        happy: { y: [0, -15, 0], transition: { repeat: Infinity, duration: 0.9 } },
      }}
    />
);


const AnimatedSignupPage: NextPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'sad' | 'happy'>('idle');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAnimationState('happy');
      toast({ title: 'Account Created!', description: 'Please check your email to verify your account.' });
      setIsSubmitted(true);
    } catch (err: any) {
      setAnimationState('sad');
      toast({ title: 'Signup Failed', description: err.message, variant: 'destructive' });
      setTimeout(() => setAnimationState('idle'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Create an Account" noindex={true} />
      <div className="flex w-full min-h-screen">
        <div className="hidden lg:flex w-1/2 bg-gray-100 dark:bg-gray-800/50 items-end justify-center relative overflow-hidden">
          <AnimatePresence>
              <>
                <PurpleRectangle state={animationState} />
                <BlackRectangle state={animationState} />
                <YellowRectangle state={animationState} />
                <OrangeSemicircle state={animationState} />
              </>
          </AnimatePresence>
        </div>
        <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-6">
            {isSubmitted ? (
                 <div className="text-center">
                    <h1 className="text-3xl font-bold text-foreground">Check your inbox</h1>
                    <p className="text-muted-foreground mt-2">We've sent a verification link to <span className="font-semibold text-primary">{email}</span>.</p>
                 </div>
            ) : (
              <>
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-foreground">Create an Account</h1>
                  <p className="text-muted-foreground mt-2">Join PDFMingle to manage your documents with ease.</p>
                </div>
                <Button variant="outline" className="w-full h-11" onClick={() => toast({ title: 'Coming Soon!', description: 'Google Sign-in will be available shortly.' })}><FcGoogle className="mr-2 h-5 w-5" /> Continue with Google</Button>
                <div className="relative flex items-center"><Separator className="flex-grow" /><span className="mx-2 flex-shrink-0 text-xs uppercase text-muted-foreground">OR</span><Separator className="flex-grow" /></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} /></div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} minLength={6} />
                      <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}{isLoading ? 'Creating...' : 'Create Account'}</Button>
                </form>
                <p className="text-center text-sm text-muted-foreground">Already have an account?{' '}<Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link></p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimatedSignupPage;
