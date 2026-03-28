// src/components/account/SettingsCard.tsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';

export const SettingsCard = () => {
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
