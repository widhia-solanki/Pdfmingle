// src/pages/account/index.tsx

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const AccountPage: NextPage = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <AuthGuard>
      <NextSeo title="My Account" noindex={true} />
      <div className="container mx-auto max-w-2xl py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-foreground">
            My Account
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </header>
        
        <div className="bg-card border border-border rounded-lg p-8 flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            {user?.image && <AvatarImage src={user.image} alt={user.name || 'User Avatar'} />}
            <AvatarFallback className="text-3xl">{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-semibold text-foreground">{user?.name}</h2>
          <p className="text-muted-foreground mt-1">{user?.email}</p>
          <Button variant="destructive" className="mt-8" onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AccountPage;
