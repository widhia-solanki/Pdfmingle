// src/pages/account.tsx

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Edit, Save } from 'lucide-react';

// --- Profile Card Component ---
const ProfileCard = () => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email?.[0].toUpperCase() || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      await update({ name: displayName });
      toast({ title: 'Success', description: 'Your profile has been updated.' });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePictureUpload = () => {
    toast({ title: 'Coming Soon!', description: 'Profile picture uploads will be available shortly.' });
  };

  return (
    <Card>
      <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Your personal information.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20"><AvatarImage src={user?.image || ''} alt={user?.name || ''} /><AvatarFallback className="text-2xl">{getInitials(user?.name)}</AvatarFallback></Avatar>
          <Button variant="outline" onClick={handlePictureUpload}>Change Picture</Button>
        </div>
        <div className="space-y-2"><Label>Email Address</Label><p className="text-sm font-medium text-muted-foreground">{user?.email}</p></div>
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isSaving} />
              <Button onClick={handleSaveProfile} size="icon" disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}</Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{user?.name || 'Not set'}</p>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// --- Settings Card Component ---
const SettingsCard = () => {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEmailNotifications(false);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Preferences</CardTitle><CardDescription>Manage your application settings.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4"><div className="h-8 w-3/4 bg-muted rounded animate-pulse" /><div className="h-8 w-1/2 bg-muted rounded animate-pulse" /></div>
        ) : (
          <>
            <div className="flex items-center justify-between"><Label htmlFor="dark-mode" className="flex flex-col space-y-1"><span>Dark Mode</span><span className="font-normal leading-snug text-muted-foreground">Enjoy a darker, eye-friendly interface.</span></Label><Switch id="dark-mode" checked={theme === 'dark'} onCheckedChange={(isDark) => setTheme(isDark ? 'dark' : 'light')} /></div>
            <div className="flex items-center justify-between"><Label htmlFor="notifications" className="flex flex-col space-y-1"><span>Email Notifications</span><span className="font-normal leading-snug text-muted-foreground">Receive updates about new features.</span></Label><Switch id="notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} /></div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// --- Delete Account Card Component ---
const DeleteAccountCard = () => {
  const { toast } = useToast();
  const handleDeleteAccount = async () => {
    toast({ title: 'Action Required', description: 'This action is permanent. Please contact support to proceed.', variant: 'destructive' });
    // In a real app, this would call a backend endpoint and then sign out
    // await fetch('/api/account/delete', { method: 'DELETE' });
    // await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <Card className="border-destructive">
      <CardHeader><CardTitle className="text-destructive">Delete Account</CardTitle><CardDescription>Permanently delete your account and all of your data. This action cannot be undone.</CardDescription></CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="destructive">Delete My Account</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action is permanent. This will permanently delete your account and remove all your data from our servers.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteAccount}>Yes, delete my account</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

// --- Main Account Page ---
const AccountPage: NextPage = () => {
  return (
    <AuthGuard>
      <NextSeo title="My Account" noindex={true} />
      <div className="w-full bg-secondary py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Account & Settings</h1>
            <p className="mt-2 text-lg text-muted-foreground">Manage your profile, preferences, and account settings.</p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1"><ProfileCard /></div>
            <div className="lg:col-span-2 space-y-8"><SettingsCard /><DeleteAccountCard /></div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AccountPage;
