// src/pages/account/index.tsx

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext'; // Use our Firebase Auth Context
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ProfileCard } from '@/components/account/ProfileCard';
import { SettingsCard } from '@/components/account/SettingsCard';
import { DeleteAccountCard } from '@/components/account/DeleteAccountCard';

const AccountPage: NextPage = () => {
  const { user, logout } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <AuthGuard>
      <NextSeo title="My Account" noindex={true} />
      <div className="container mx-auto max-w-4xl py-12">
        <header className="mb-10 flex items-center gap-6">
          <Avatar className="h-24 w-24">
            {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
            <AvatarFallback className="text-3xl">{getInitials(user?.displayName)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              {user?.displayName || 'My Account'}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </header>
        
        <div className="space-y-8">
          <ProfileCard />
          <Separator />
          <SettingsCard />
          <Separator />
          <DeleteAccountCard />
        </div>
      </div>
    </AuthGuard>
  );
};

export default AccountPage;
